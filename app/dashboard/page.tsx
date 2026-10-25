import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Building, Users, Calendar, ShieldCheck, LogOut, 
  Clock, Filter, Plus, AlertCircle, CheckCircle2 
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { logoutUser } from '@/app/actions/auth';
import type { Property, Broker } from '@/types';

export const revalidate = 0;

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { broker_filter?: string };
}) {
  const supabase = await createClient();

  // 1. Kiểm tra đăng nhập
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

  const isAdmin = currentBrokerData?.is_admin === true || user.email?.includes('admin');
  const currentBroker = currentBrokerData as Broker | null;

  // 3. NẾU MÔI GIỚI MỚI ĐĂNG KÝ VÀ ĐANG CHỜ DUYỆT (status = 'pending')
  if (!isAdmin && currentBroker?.status === 'pending') {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="rounded-3xl border border-amber-200 bg-amber-50/70 p-8 text-center sm:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
            <Clock size={36} className="animate-spin-slow" />
          </div>
          <h1 className="mt-5 text-2xl font-black text-navy-950">Hồ Sơ Đang Chờ Phê Duyệt</h1>
          <p className="mt-2 text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
            Xin chào <strong>{currentBroker?.full_name || user.email}</strong>, tài khoản thành viên môi giới của bạn đã được tạo thành công và đang được <strong>Ban Quản Trị thẩm định hồ sơ & chứng chỉ</strong>.
          </p>

          <div className="mt-8 rounded-2xl bg-white p-5 border border-amber-200/80 text-left text-xs space-y-2 max-w-md mx-auto">
            <p className="font-bold text-navy-950">Thông tin hồ sơ đăng ký:</p>
            <p className="text-stone-600">• Họ tên: {currentBroker?.full_name}</p>
            <p className="text-stone-600">• Điện thoại: {currentBroker?.phone}</p>
            <p className="text-stone-600">• Địa bàn: {currentBroker?.coverage_areas?.join(', ')}</p>
            <p className="text-stone-600">• Trạng thái: <span className="font-bold text-amber-700">Chờ duyệt (Pending)</span></p>
          </div>

          <div className="mt-8 flex justify-center gap-3">
            <Link
              href="/dashboard/profile"
              className="rounded-xl border border-stone-200 bg-white px-5 py-2.5 text-xs font-bold text-navy-950 hover:bg-stone-50"
            >
              Cập nhật lại hồ sơ
            </Link>
            <form action={logoutUser}>
              <button
                type="submit"
                className="rounded-xl bg-navy-900 px-5 py-2.5 text-xs font-bold text-champagne-300 hover:bg-navy-800"
              >
                Đăng xuất
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // 4. MÔI GIỚI ĐÃ ĐƯỢC DUYỆT (approved) HOẶC ADMIN -> VÀO WORKSPACE BÌNH THƯỜNG
  let propQuery = supabase.from('properties').select('*, brokers(*)').order('created_at', { ascending: false });
  let leadQuery = supabase.from('leads').select('*, properties(*)').order('created_at', { ascending: false });
  let apptQuery = supabase.from('appointments').select('*, properties(*)').order('created_at', { ascending: false });

  let allBrokers: Broker[] = [];
  if (isAdmin) {
    const { data: bList } = await supabase.from('brokers').select('*').order('full_name');
    allBrokers = (bList || []) as Broker[];

    if (searchParams.broker_filter) {
      propQuery = propQuery.eq('broker_id', searchParams.broker_filter);
      leadQuery = leadQuery.eq('broker_id', searchParams.broker_filter);
      apptQuery = apptQuery.eq('broker_id', searchParams.broker_filter);
    }
  } else {
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
                  ? 'border border-rose-300 bg-rose-100 text-rose-800' 
                  : 'border border-champagne-300 bg-champagne-100 text-champagne-800'
              }`}>
                {isAdmin ? 'Tổng Quản Trị Hệ Thống' : 'Môi Giới Xác Thực'}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-stone-500">
              {isAdmin 
                ? 'Đang xem toàn bộ dữ liệu sàn TP.HCM – Đồng Nai' 
                : `Khu vực phụ trách: ${currentBroker?.coverage_areas?.join(', ') || 'Chưa cập nhật'}`}
            </p>
          </div>
        </div>

        {/* CỤM NÚT ĐIỀU HƯỚNG */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/dashboard/properties/new"
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-champagne-400 to-champagne-600 px-4 py-2.5 text-xs font-black text-navy-950 shadow-md transition hover:brightness-105"
          >
            <Plus size={16} /> Đăng BĐS mới
          </Link>

          <Link
            href="/dashboard/kpi"
            className="flex items-center gap-1.5 rounded-xl border border-champagne-400 bg-sand-50 px-4 py-2.5 text-xs font-black text-champagne-800 shadow-sm transition hover:bg-champagne-100"
          >
            <ShieldCheck size={16} className="text-champagne-600" /> KPI & Review Môi Giới
          </Link>

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

      {/* BỘ LỌC ADMIN */}
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

      {/* DANH SÁCH LỊCH HẸN & KHÁCH HÀNG */}
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-base font-black text-navy-950">
            <Calendar size={18} className="text-champagne-600" /> Lịch Hẹn Xem Nhà Thực Tế ({apptsList.length})
          </h2>

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

        <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-base font-black text-navy-950">
            <Users size={18} className="text-champagne-600" /> Khách Hàng Tiềm Năng (Leads) ({leadsList.length})
          </h2>

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
