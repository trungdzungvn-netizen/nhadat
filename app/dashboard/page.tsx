import { ShieldCheck, Plus, Calendar, Users, Building, ArrowUpRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import type { Property, Lead, Appointment } from '@/types';

export const revalidate = 0;

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: properties } = await supabase.from('properties').select('*').order('created_at', { ascending: false });
  const { data: leads } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
  const { data: appointments } = await supabase.from('appointments').select('*').order('created_at', { ascending: false });

  const totalProps = properties?.length || 0;
  const totalLeads = leads?.length || 0;
  const totalAppts = appointments?.length || 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* HEADER WORKSPACE */}
      <div className="flex flex-col justify-between gap-4 border-b border-stone-200 pb-6 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-champagne-400 px-3 py-1 text-[11px] font-black text-navy-950">BROKER WORKSPACE</span>
            <span className="text-xs text-stone-500">TP.HCM – Đồng Nai</span>
          </div>
          <h1 className="mt-2 text-2xl font-black text-navy-950 sm:text-3xl">Không Gian Làm Việc Môi Giới</h1>
        </div>
      </div>

      {/* 4 PHÂN HỆ THỐNG KÊ NHANH */}
      <div className="mt-8 grid gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-navy-900">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">1. Nguồn Hàng</span>
            <Building size={20} className="text-champagne-500" />
          </div>
          <p className="mt-3 text-3xl font-black text-navy-950">{totalProps}</p>
          <p className="mt-1 text-[11px] text-emerald-600 font-semibold">Đang quản lý trên sàn</p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-navy-900">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">2. Khách Hàng (Leads)</span>
            <Users size={20} className="text-champagne-500" />
          </div>
          <p className="mt-3 text-3xl font-black text-navy-950">{totalLeads}</p>
          <p className="mt-1 text-[11px] text-blue-600 font-semibold">Yêu cầu tư vấn mới</p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-navy-900">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">3. Lịch Hẹn Xem Nhà</span>
            <Calendar size={20} className="text-champagne-500" />
          </div>
          <p className="mt-3 text-3xl font-black text-navy-950">{totalAppts}</p>
          <p className="mt-1 text-[11px] text-amber-600 font-semibold">Lịch hẹn khách gửi</p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-navy-900">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">4. Giao Dịch</span>
            <ShieldCheck size={20} className="text-champagne-500" />
          </div>
          <p className="mt-3 text-3xl font-black text-navy-950">98.5%</p>
          <p className="mt-1 text-[11px] text-emerald-600 font-semibold">Tỷ lệ hài lòng</p>
        </div>
      </div>

      {/* DANH SÁCH LỊCH HẸN & KHÁCH HÀNG MỚI */}
      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        {/* LỊCH HẸN GẦN NHẤT */}
        <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-black text-navy-950">Lịch Hẹn Xem Nhà Mới Nhất</h2>
          <div className="mt-4 space-y-3">
            {appointments && appointments.length > 0 ? (
              appointments.map((appt: any) => (
                <div key={appt.id} className="flex items-center justify-between rounded-2xl bg-sand-50 p-4 border border-stone-200">
                  <div>
                    <p className="font-bold text-navy-950 text-xs sm:text-sm">{appt.customer_name} · {appt.customer_phone}</p>
                    <p className="text-[11px] text-stone-500 mt-0.5">Ngày: {appt.appointment_date} · Khung: {appt.time_slot}</p>
                    {appt.note && <p className="text-[11px] text-stone-600 italic mt-1">"{appt.note}"</p>}
                  </div>
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-[10px] font-bold text-amber-800">
                    {appt.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-stone-500 py-6 text-center">Chưa có lịch hẹn xem nhà nào.</p>
            )}
          </div>
        </div>

        {/* NGUỒN KHÁCH HÀNG TIỀM NĂNG */}
        <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-black text-navy-950">Khách Hàng Cần Tư Vấn (Leads)</h2>
          <div className="mt-4 space-y-3">
            {leads && leads.length > 0 ? (
              leads.map((lead: any) => (
                <div key={lead.id} className="flex items-center justify-between rounded-2xl bg-sand-50 p-4 border border-stone-200">
                  <div>
                    <p className="font-bold text-navy-950 text-xs sm:text-sm">{lead.customer_name} · {lead.customer_phone}</p>
                    <p className="text-[11px] text-stone-500 mt-0.5">{lead.note || 'Yêu cầu tư vấn thông tin bất động sản'}</p>
                  </div>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-[10px] font-bold text-blue-800">
                    {lead.stage}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-stone-500 py-6 text-center">Chưa có khách hàng tiềm năng mới.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
