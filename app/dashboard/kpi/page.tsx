import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowLeft, Star, Award, TrendingUp, Users, Calendar, 
  CheckCircle, MessageSquare, ThumbsUp, ShieldCheck, Filter, Target, Eye
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { updateBrokerKPI, toggleReviewApproval } from '@/app/actions/kpi_review';
import type { Broker, BrokerReview, Appointment, Lead, Property } from '@/types';

export const revalidate = 0;

export default async function BrokerKPIPage({
  searchParams,
}: {
  searchParams: { broker_id?: string };
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Lấy thông tin user hiện tại
  const { data: currentBrokerData } = await supabase
    .from('brokers')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  const isAdmin = currentBrokerData?.is_admin === true || user.email?.includes('admin');
  let allBrokers: Broker[] = [];

  if (isAdmin) {
    const { data: bList } = await supabase.from('brokers').select('*').order('full_name');
    allBrokers = (bList || []) as Broker[];
  }

  // Xác định broker mục tiêu cần xem KPI
  let targetBrokerId = currentBrokerData?.id;
  if (isAdmin && searchParams.broker_id) {
    targetBrokerId = searchParams.broker_id;
  }

  // Lấy thông tin môi giới mục tiêu
  let targetBroker: Broker | null = null;
  if (targetBrokerId) {
    const { data: bData } = await supabase.from('brokers').select('*').eq('id', targetBrokerId).maybeSingle();
    targetBroker = bData as Broker | null;
  } else if (allBrokers.length > 0) {
    targetBroker = allBrokers[0];
    targetBrokerId = targetBroker.id;
  }

  // Truy vấn dữ liệu thực tế của broker
  const [reviewsRes, apptsRes, leadsRes, propsRes] = await Promise.all([
    supabase.from('broker_reviews').select('*').eq('broker_id', targetBrokerId || '').order('created_at', { ascending: false }),
    supabase.from('appointments').select('*').eq('broker_id', targetBrokerId || ''),
    supabase.from('leads').select('*').eq('broker_id', targetBrokerId || ''),
    supabase.from('properties').select('*').eq('broker_id', targetBrokerId || ''),
  ]);

  const reviews = (reviewsRes.data || []) as BrokerReview[];
  const appts = (apptsRes.data || []) as Appointment[];
  const leads = (leadsRes.data || []) as Lead[];
  const props = (propsRes.data || []) as Property[];

  // Tính toán các chỉ số thực tế
  const actualDeals = leads.filter(l => l.stage === 'won').length;
  const targetDeals = targetBroker?.kpi_target_deals || 3;
  const pctDeals = Math.min(100, Math.round((actualDeals / targetDeals) * 100));

  const actualAppts = appts.filter(a => a.status === 'completed' || a.status === 'confirmed').length;
  const targetAppts = targetBroker?.kpi_target_appts || 10;
  const pctAppts = Math.min(100, Math.round((actualAppts / targetAppts) * 100));

  const actualLeads = leads.length;
  const targetLeads = targetBroker?.kpi_target_leads || 15;
  const pctLeads = Math.min(100, Math.round((actualLeads / targetLeads) * 100));

  // Điểm trung bình các tiêu chí
  const avgRating = targetBroker?.rating || 5.0;
  const avgAttitude = reviews.length ? (reviews.reduce((a, b) => a + (b.criteria_attitude || 5), 0) / reviews.length).toFixed(1) : '5.0';
  const avgExpertise = reviews.length ? (reviews.reduce((a, b) => a + (b.criteria_expertise || 5), 0) / reviews.length).toFixed(1) : '5.0';
  const avgNegotiation = reviews.length ? (reviews.reduce((a, b) => a + (b.criteria_negotiation || 5), 0) / reviews.length).toFixed(1) : '5.0';

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* HEADER & QUAY LẠI */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 text-xs font-bold text-navy-800 hover:text-champagne-600"
        >
          <ArrowLeft size={16} /> Quay lại Workspace
        </Link>
        <span className="rounded-full bg-champagne-100 border border-champagne-300 px-3 py-1 text-[11px] font-black text-champagne-800">
          Chỉ Số KPI & Đánh Giá Khách Hàng Tháng {new Date().getMonth() + 1}/{new Date().getFullYear()}
        </span>
      </div>

      {/* ADMIN FILTER: CHỌN MÔI GIỚI */}
      {isAdmin && (
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-champagne-300 bg-champagne-50/70 p-4">
          <div className="flex items-center gap-2 text-xs font-bold text-navy-900">
            <Filter size={16} className="text-champagne-600" />
            <span>Chế độ Admin: Xem hiệu suất KPI của từng môi giới</span>
          </div>
          <form method="GET" action="/dashboard/kpi" className="flex items-center gap-2">
            <select
              name="broker_id"
              defaultValue={targetBrokerId || ''}
              className="rounded-xl border border-champagne-300 bg-white px-3 py-2 text-xs font-bold text-navy-900 focus:outline-none"
            >
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
              Xem KPI
            </button>
          </form>
        </div>
      )}

      {/* THÔNG TIN MÔI GIỚI ĐANG XEM */}
      <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 overflow-hidden rounded-2xl border-2 border-champagne-400 bg-navy-900 shadow-md">
              <Image
                src={targetBroker?.avatar_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80'}
                alt={targetBroker?.full_name || 'Môi giới'}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-navy-950">{targetBroker?.full_name || 'Chuyên viên tư vấn'}</h1>
                {targetBroker?.is_verified && (
                  <span className="rounded-full bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 flex items-center gap-1">
                    <ShieldCheck size={12} /> Đã xác thực
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-xs text-stone-500">
                Hotline: {targetBroker?.phone} · Khu vực: {targetBroker?.coverage_areas?.join(', ') || 'TP.HCM - Đồng Nai'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-champagne-200 bg-sand-50 px-5 py-3 text-center">
              <span className="flex items-center justify-center gap-1 text-2xl font-black text-champagne-600">
                <Star size={22} className="fill-champagne-500 text-champagne-500" /> {avgRating}
              </span>
              <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 mt-0.5">
                {reviews.length} lượt đánh giá
              </p>
            </div>
          </div>
        </div>

        {/* 1. KHỐI TIẾN ĐỘ KPI THÁNG */}
        <div className="mt-8 border-t border-stone-100 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-black uppercase tracking-wider text-navy-950 flex items-center gap-2">
              <Target size={18} className="text-champagne-600" /> Tiến Độ KPI Mục Tiêu Tháng
            </h2>
            <span className="text-xs text-stone-400 font-medium">Cập nhật tự động theo trạng thái giao dịch & lịch hẹn</span>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {/* KPI 1: GIAO DỊCH THÀNH CÔNG */}
            <div className="rounded-2xl border border-stone-200 bg-sand-50/50 p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-navy-900">Giao dịch thành công (Won)</span>
                <span className="text-sm font-black text-navy-950">{actualDeals} / {targetDeals} căn</span>
              </div>
              <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-stone-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-champagne-400 to-champagne-600 transition-all duration-500"
                  style={{ width: `${pctDeals}%` }}
                />
              </div>
              <p className="mt-2 text-[11px] font-semibold text-stone-500 flex justify-between">
                <span>Tiến độ hoàn thành</span>
                <span className="text-champagne-600 font-bold">{pctDeals}%</span>
              </p>
            </div>

            {/* KPI 2: DẪN KHÁCH XEM NHÀ */}
            <div className="rounded-2xl border border-stone-200 bg-sand-50/50 p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-navy-900">Lịch xem nhà thực tế</span>
                <span className="text-sm font-black text-navy-950">{actualAppts} / {targetAppts} lượt</span>
              </div>
              <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-stone-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-500"
                  style={{ width: `${pctAppts}%` }}
                />
              </div>
              <p className="mt-2 text-[11px] font-semibold text-stone-500 flex justify-between">
                <span>Đã thực hiện & xác nhận</span>
                <span className="text-emerald-600 font-bold">{pctAppts}%</span>
              </p>
            </div>

            {/* KPI 3: TIẾP NHẬN & CHĂM SÓC KHÁCH */}
            <div className="rounded-2xl border border-stone-200 bg-sand-50/50 p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-navy-900">Khách hàng mới (Leads)</span>
                <span className="text-sm font-black text-navy-950">{actualLeads} / {targetLeads} khách</span>
              </div>
              <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-stone-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500"
                  style={{ width: `${pctLeads}%` }}
                />
              </div>
              <p className="mt-2 text-[11px] font-semibold text-stone-500 flex justify-between">
                <span>Chỉ tiêu chăm sóc</span>
                <span className="text-blue-600 font-bold">{pctLeads}%</span>
              </p>
            </div>
          </div>
        </div>

        {/* 2. KHỐI CHI TIẾT 3 TIÊU CHÍ REVIEW TỪ KHÁCH HÀNG */}
        <div className="mt-8 border-t border-stone-100 pt-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-navy-950 mb-4 flex items-center gap-2">
            <ThumbsUp size={18} className="text-champagne-600" /> Điểm Đánh Giá Chi Tiết Theo 3 Tiêu Chí Dịch Vụ
          </h2>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-stone-200 bg-white p-4 text-center shadow-sm">
              <p className="text-xs font-semibold text-stone-500">1. Thái độ & Tác phong làm việc</p>
              <p className="mt-2 text-2xl font-black text-navy-950">{avgAttitude} <span className="text-xs text-stone-400">/ 5.0</span></p>
              <div className="mt-2 flex justify-center gap-1 text-amber-400">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} size={14} className={i <= Math.round(Number(avgAttitude)) ? 'fill-amber-400' : 'text-stone-300'} />
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-stone-200 bg-white p-4 text-center shadow-sm">
              <p className="text-xs font-semibold text-stone-500">2. Am hiểu quy hoạch & pháp lý</p>
              <p className="mt-2 text-2xl font-black text-navy-950">{avgExpertise} <span className="text-xs text-stone-400">/ 5.0</span></p>
              <div className="mt-2 flex justify-center gap-1 text-amber-400">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} size={14} className={i <= Math.round(Number(avgExpertise)) ? 'fill-amber-400' : 'text-stone-300'} />
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-stone-200 bg-white p-4 text-center shadow-sm">
              <p className="text-xs font-semibold text-stone-500">3. Kỹ năng thương lượng giá tốt</p>
              <p className="mt-2 text-2xl font-black text-navy-950">{avgNegotiation} <span className="text-xs text-stone-400">/ 5.0</span></p>
              <div className="mt-2 flex justify-center gap-1 text-amber-400">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} size={14} className={i <= Math.round(Number(avgNegotiation)) ? 'fill-amber-400' : 'text-stone-300'} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. KHỐI DANH SÁCH REVIEW THỰC TẾ & FORM THIẾT LẬP KPI CỦA ADMIN */}
      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* CỘT TRÁI (2 CỘT): FEED REVIEW CỦA KHÁCH HÀNG */}
        <div className="lg:col-span-2 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <h2 className="text-base font-black text-navy-950 flex items-center gap-2">
              <MessageSquare size={18} className="text-champagne-600" /> Nhận Xét Từ Khách Hàng Thực Tế ({reviews.length})
            </h2>
            <Link
              href={`/brokers/${targetBrokerId}/review`}
              target="_blank"
              className="text-xs font-bold text-champagne-600 hover:underline flex items-center gap-1"
            >
              Mở link gửi đánh giá ↗
            </Link>
          </div>

          <div className="mt-4 space-y-4">
            {reviews.length > 0 ? (
              reviews.map((rev) => (
                <div key={rev.id} className="rounded-2xl border border-stone-100 bg-sand-50/60 p-4 transition hover:bg-sand-50">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-navy-950 text-xs sm:text-sm">{rev.customer_name}</p>
                      <p className="text-[11px] text-stone-400 mt-0.5">
                        {new Date(rev.created_at).toLocaleDateString('vi-VN')} {rev.customer_phone ? `· ${rev.customer_phone}` : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-xs font-bold text-amber-700">
                      <Star size={13} className="fill-amber-400 text-amber-400" /> {rev.rating} sao
                    </div>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-stone-700 italic">
                    "{rev.comment}"
                  </p>

                  {isAdmin && (
                    <div className="mt-3 flex justify-end border-t border-stone-200/60 pt-2">
                      <form action={toggleReviewApproval.bind(null, rev.id, rev.is_approved)}>
                        <button
                          type="submit"
                          className="text-[11px] font-bold text-stone-500 hover:text-rose-600 underline"
                        >
                          {rev.is_approved ? 'Ẩn đánh giá này' : 'Hiển thị công khai'}
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="py-8 text-center text-xs text-stone-500">Môi giới chưa nhận được đánh giá nào từ khách hàng.</p>
            )}
          </div>
        </div>

        {/* CỘT PHẢI (1 CỘT): FORM GIAO KPI CHO ADMIN */}
        <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-black text-navy-950 flex items-center gap-2 border-b border-stone-100 pb-3">
            <Award size={18} className="text-champagne-600" /> Thiết Lập Mục Tiêu KPI
          </h2>
          <p className="mt-2 text-xs text-stone-500 leading-relaxed">
            {isAdmin 
              ? 'Admin có thể điều chỉnh mục tiêu số lượng giao dịch, lịch hẹn và khách hàng mới trong tháng cho môi giới này.'
              : 'Mục tiêu làm việc của bạn trong tháng do Ban quản trị giao.'}
          </p>

          <form action={updateBrokerKPI} className="mt-6 space-y-4">
            <input type="hidden" name="broker_id" value={targetBrokerId || ''} />

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy-900">
                Chỉ tiêu Giao dịch (Căn / tháng)
              </label>
              <input
                type="number"
                name="kpi_target_deals"
                min="1"
                max="50"
                disabled={!isAdmin}
                defaultValue={targetDeals}
                className="mt-1 w-full rounded-xl border border-stone-200 p-3 text-xs font-bold text-navy-950 focus:border-champagne-500 focus:outline-none disabled:bg-sand-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy-900">
                Chỉ tiêu Lịch hẹn xem nhà (Lượt / tháng)
              </label>
              <input
                type="number"
                name="kpi_target_appts"
                min="1"
                max="100"
                disabled={!isAdmin}
                defaultValue={targetAppts}
                className="mt-1 w-full rounded-xl border border-stone-200 p-3 text-xs font-bold text-navy-950 focus:border-champagne-500 focus:outline-none disabled:bg-sand-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy-900">
                Chỉ tiêu Khách hàng chăm sóc (Leads / tháng)
              </label>
              <input
                type="number"
                name="kpi_target_leads"
                min="1"
                max="200"
                disabled={!isAdmin}
                defaultValue={targetLeads}
                className="mt-1 w-full rounded-xl border border-stone-200 p-3 text-xs font-bold text-navy-950 focus:border-champagne-500 focus:outline-none disabled:bg-sand-100"
              />
            </div>

            {isAdmin && (
              <button
                type="submit"
                className="w-full rounded-xl bg-navy-900 py-3 text-xs font-black text-champagne-300 shadow-md transition hover:bg-navy-800"
              >
                CẬP NHẬT MỤC TIÊU KPI
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
