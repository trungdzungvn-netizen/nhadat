import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Building, Users, Calendar, ShieldCheck, LogOut, 
  MapPin, Phone, Mail, CheckCircle2, Clock, Filter, AlertCircle, UserCheck 
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { logoutUser } from '@/app/actions/auth';
import type { Property, Lead, Appointment, Broker } from '@/types';

export const revalidate = 0;

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { broker_filter?: string };
}) {
  const supabase = await createClient();

  // 1. Kiểm tra phiên đăng nhập
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  // 2. Lấy thông tin Môi giới tương ứng với user đang đăng nhập
  const { data: currentBrokerData } = await supabase
    .from('brokers')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  // Kiểm tra vai trò Admin (có is_admin = true hoặc email admin)
  const isAdmin = currentBrokerData?.is_admin === true || user.email?.includes('admin');
  const currentBroker = currentBrokerData as Broker | null;

  // 3. Chuẩn bị truy vấn dữ liệu theo phân quyền
  let propQuery = supabase.from('properties').select('*, brokers(*)').order('created_at', { ascending: false });
  let leadQuery = supabase.from('leads').select('*, properties(*)').order('created_at', { ascending: false });
  let apptQuery = supabase.from('appointments').select('*, properties(*)').order('created_at', { ascending: false });

  // Danh sách toàn bộ môi giới cho bộ lọc của Admin
  let allBrokers: Broker[] = [];
  if (isAdmin) {
    const { data: bList } = await supabase.from('brokers').select('*').order('full_name');
    allBrokers = (bList || []) as Broker[];

    // Nếu Admin chọn lọc theo 1 môi giới cụ thể
    if (searchParams.broker_filter) {
      propQuery = propQuery.eq('broker_id', searchParams.broker_filter);
      leadQuery = leadQuery.eq('broker_id', searchParams.broker_filter);
      apptQuery = apptQuery.eq('broker_id', searchParams.broker_filter);
    }
  } else {
    // Môi giới thường: chỉ xem dữ liệu do chính mình phụ trách
    const brokerId = currentBroker?.id;
    if (brokerId) {
      propQuery = propQuery.eq('broker_id', brokerId);
      leadQuery = leadQuery.eq('broker_id', brokerId);
      apptQuery = apptQuery.eq('broker_id', brokerId);
    } else {
      propQuery = propQuery.eq('id', '00000000-0000-0000-0000-000000000000');
    }
  }

  const [{ data: properties }, { data: leads }, { data: appointments }] = await Promise.all([
    propQuery,
    leadQuery,
    apptQuery,
  ]);

  const propsList = (properties || []) as Property[];
  const leadsList = (leads || []) as any[];
  const apptsList = (appointments || []) as any[];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* THANH THÔNG TIN TÀI KHOẢN VÀ THAO TÁC NHANH */}
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <div className="relative h-14 w-14 overflow-hidden rounded-2xl border-2 border-champagne-400 bg-navy-900 shadow-md">
            <Image
              src={currentBroker?.avatar_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80'}
              alt="Avatar"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-navy-950">
                {isAdmin ? 'Quản Trị Viên (Admin)' : (currentBroker?.full_name || user.email)}
              </h1>
              <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                isAdmin 
                  ? 'bg-rose-100 text-rose-800 border border-rose-300' 
                  : 'bg-champagne-100 text-champagne-800 border border-champagne-300'
              }`}>
                {isAdmin ? 'Tổng Quản Trị Hệ Thống' : 'Môi Giới Xác Thực'}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-stone-500">
              {isAdmin 
                ? 'Đang xem toàn bộ dữ liệu sàn TP.HCM – Đồng Nai' 
                : `Khu vực: ${currentBroker?.coverage_areas?.join(', ') || 'Chưa cập nhật'}`}
            </p>
          </div>
        </div>

        {/* CÁC NÚT ĐIỀU HƯỚNG QUẢN LÝ */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/dashboard/profile"
            className="rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-xs font-bold text-navy-950 shadow-sm transition hover:bg-sand-50"
          >
            Chỉnh sửa hồ sơ
          </Link>

          {isAdmin && (
            <Link
              href="/dashboard/brokers"
              className="rounded-xl bg-champagne-500 px-4 py-2.5 text-xs font-black text-navy-950 shadow-sm transition hover:brightness-105"
            >
              Quản lý đội ngũ ({allBrokers.length})
            </Link>
          )}

          <form action={logoutUser}>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-xl border border-stone-200 px-4 py-2.5 text-xs font-bold text-stone-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
            >
              <LogOut size={15} /> Đăng xuất
            </button>
          </form>
        </div>
      </div>

      {/* BỘ LỌC CỦA ADMIN (CHỈ HIỂN THỊ KHI ĐĂNG NHẬP VỚI QUYỀN ADMIN) */}
      {isAdmin && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-champagne-300 bg-champagne-50/60 p-4">
          <div className="flex items-center gap-2 text-xs font-bold text-navy-900">
            <Filter size={16} className="text-champagne-600" />
            <span>Chế độ Admin: Lọc thông tin theo từng môi giới</span>
          </div>
          <form method="GET" action="/dashboard" className="flex items-center gap-2">
            <select
              name="broker_filter"
              defaultValue={searchParams.broker_filter || ''}
              className="rounded-xl border border-champagne-300 bg-white px-3 py-2 text-xs font-semibold text-navy-900 focus:outline-none"
            >
              <option value="">Xem chung tất cả ({allBrokers.length} môi giới)</option>
              {allBrokers.map((b) => (
                <option key={b.id} value={b.id}>
                  Môi giới: {b.full_name} ({b.phone})
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="rounded-xl bg-navy-900 px-4 py-2 text-xs font-bold text-champagne-300 hover:bg-navy-800"
            >
              Lọc dữ liệu
            </button>
          </form>
        </div>
      )}

      {/* THỐNG KÊ 4 PHÂN HỆ CỐT LÕI */}
      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-navy-900">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Nguồn Hàng Đang Bán</span>
            <Building size={20} className="text-champagne-500" />
          </div>
          <p className="mt-3 text-3xl font-black text-navy-950">{propsList.length}</p>
          <p className="mt-1 text-[11px] font-semibold text-emerald-600">
            {isAdmin ? 'Toàn sàn quản lý' : 'Sản phẩm của bạn'}
          </p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-navy-900">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Khách Hàng (Leads)</span>
            <Users size={20} className="text-champagne-500" />
          </div>
          <p className="mt-3 text-3xl font-black text-navy-950">{leadsList.length}</p>
          <p className="mt-1 text-[11px] font-semibold text-blue-600">
            {isAdmin ? 'Tổng khách toàn hệ thống' : 'Khách cần chăm sóc'}
          </p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-navy-900">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Lịch Hẹn Xem Nhà</span>
            <Calendar size={20} className="text-champagne-500" />
          </div>
          <p className="mt-3 text-3xl font-black text-navy-950">{apptsList.length}</p>
          <p className="mt-1 text-[11px] font-semibold text-amber-600">
            {isAdmin ? 'Tổng lịch toàn sàn' : 'Lịch hẹn cần đi dẫn'}
          </p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-navy-900">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Hiệu Quả Tư Vấn</span>
            <ShieldCheck size={20} className="text-champagne-500" />
          </div>
          <p className="mt-3 text-3xl font-black text-navy-950">{currentBroker?.rating || '4.9'}★</p>
          <p className="mt-1 text-[11px] font-semibold text-emerald-600">Xác thực chứng chỉ</p>
        </div>
      </div>

      {/* CHI TIẾT 2 CỘT: LỊCH HẸN & KHÁCH HÀNG */}
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {/* CỘT 1: LỊCH HẸN XEM NHÀ */}
        <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-base font-black text-navy-950">
              <Calendar size={18} className="text-champagne-600" /> Lịch Hẹn Xem Nhà Thực Tế ({apptsList.length})
            </h2>
          </div>

          <div className="mt-4 space-y-3">
            {apptsList.length > 0 ? (
              apptsList.map((appt) => (
                <div key={appt.id} className="rounded-2xl border border-stone-200 bg-sand-50/60 p-4 transition hover:bg-sand-50">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold text-navy-950">
                        {appt.customer_name} · <a href={`tel:${appt.customer_phone}`} className="text-blue-700 underline">{appt.customer_phone}</a>
                      </p>
                      <p className="mt-1 text-xs font-medium text-stone-600">
                        Sản phẩm: {appt.properties?.title || 'Bất động sản'}
                      </p>
                      <div className="mt-2 flex items-center gap-3 text-[11px] text-stone-500">
                        <span className="flex items-center gap-1 font-semibold text-navy-900">
                          <Clock size={13} className="text-champagne-600" /> {appt.appointment_date} ({appt.time_slot})
                        </span>
                      </div>
                    </div>
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-[10px] font-bold text-amber-800">
                      {appt.status}
                    </span>
                  </div>
                  {appt.note && (
                    <p className="mt-2 rounded-lg border border-stone-200 bg-white p-2 text-xs italic text-stone-500">
                      "{appt.note}"
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="py-8 text-center text-xs text-stone-500">Chưa có lịch hẹn nào được ghi nhận.</p>
            )}
          </div>
        </div>

        {/* CỘT 2: KHÁCH HÀNG TIỀM NĂNG (LEADS) */}
        <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-base font-black text-navy-950">
              <Users size={18} className="text-champagne-600" /> Khách Hàng Tiềm Năng (Leads) ({leadsList.length})
            </h2>
          </div>

          <div className="mt-4 space-y-3">
            {leadsList.length > 0 ? (
              leadsList.map((lead) => (
                <div key={lead.id} className="rounded-2xl border border-stone-200 bg-sand-50/60 p-4 transition hover:bg-sand-50">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold text-navy-950">
                        {lead.customer_name} · <a href={`tel:${lead.customer_phone}`} className="text-blue-700 underline">{lead.customer_phone}</a>
                      </p>
                      <p className="mt-1 text-xs text-stone-600">{lead.note || 'Khách quan tâm nguồn hàng'}</p>
                      <p className="mt-1.5 text-[11px] text-stone-400">
                        Ngày nhận: {new Date(lead.created_at).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-[10px] font-bold uppercase text-blue-800">
                      {lead.stage}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="py-8 text-center text-xs text-stone-500">Chưa có khách hàng nào trong giỏ hàng.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
