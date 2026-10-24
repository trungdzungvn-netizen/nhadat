import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, CheckCircle, XCircle, Edit3, Phone } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { toggleBrokerVerification } from '@/app/actions/broker';
import type { Broker } from '@/types';

export const revalidate = 0;

export default async function AdminBrokersListPage({
  searchParams,
}: {
  searchParams?: { updated?: string };
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Kiểm tra quyền Admin
  const { data: check } = await supabase
    .from('brokers')
    .select('is_admin')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!check?.is_admin && !user.email?.includes('admin')) {
    redirect('/dashboard');
  }

  const { data: brokers } = await supabase
    .from('brokers')
    .select('*')
    .order('created_at', { ascending: false });

  const brokersList = (brokers || []) as (Broker & { is_admin?: boolean })[];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 text-xs font-bold text-navy-800 hover:text-champagne-600"
        >
          <ArrowLeft size={16} /> Quay lại Workspace
        </Link>
        <span className="rounded-full bg-rose-100 border border-rose-300 px-3 py-1 text-[11px] font-black text-rose-800">
          Admin Portal · Quản Lý Đội Ngũ Môi Giới
        </span>
      </div>

      {searchParams?.updated === '1' && (
        <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-800">
          Đã cập nhật thông tin môi giới thành công!
        </div>
      )}

      <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
        <div className="border-b border-stone-100 pb-4">
          <h1 className="text-xl font-black text-navy-950">Danh Sách Môi Giới Toàn Hệ Thống ({brokersList.length})</h1>
          <p className="mt-1 text-xs text-stone-500">
            Cập nhật trực tiếp số điện thoại, địa bàn phụ trách, avatar, chứng chỉ hành nghề và trạng thái xác thực.
          </p>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-xs text-navy-950 min-w-[760px]">
            <thead className="bg-sand-100 text-[11px] uppercase tracking-wider text-stone-600">
              <tr>
                <th className="p-3.5 rounded-l-xl">Môi giới</th>
                <th className="p-3.5">Điện thoại / Zalo</th>
                <th className="p-3.5">Địa bàn phụ trách</th>
                <th className="p-3.5">Chứng chỉ</th>
                <th className="p-3.5">Trạng thái</th>
                <th className="p-3.5 rounded-r-xl text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {brokersList.map((broker) => (
                <tr key={broker.id} className="hover:bg-sand-50/60">
                  <td className="p-3.5">
                    <div className="flex items-center gap-3">
                      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-champagne-400 bg-navy-900">
                        <Image
                          src={broker.avatar_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80'}
                          alt={broker.full_name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-navy-950 flex items-center gap-1.5">
                          {broker.full_name}
                          {broker.is_admin && (
                            <span className="rounded bg-rose-100 px-1.5 py-0.2 text-[9px] font-black text-rose-700">Admin</span>
                          )}
                        </p>
                        <p className="text-[11px] text-stone-400">{broker.experience_years} năm KN · {broker.rating}★</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <p className="font-semibold text-navy-900">{broker.phone}</p>
                    <p className="text-[11px] text-stone-400">Zalo: {broker.zalo_phone || broker.phone}</p>
                  </td>
                  <td className="p-3.5">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {broker.coverage_areas?.map((a) => (
                        <span key={a} className="rounded-md bg-sand-100 px-2 py-0.5 text-[10px] font-semibold text-navy-800">
                          {a}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3.5">
                    <span className="font-medium text-stone-600">
                      {broker.license_number || 'Chưa cung cấp'}
                    </span>
                  </td>
                  <td className="p-3.5">
                    {broker.is_verified ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                        <CheckCircle size={12} /> Đã xác thực
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-800">
                        <XCircle size={12} /> Chưa xác thực
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/dashboard/brokers/${broker.id}/edit`}
                        className="inline-flex items-center gap-1 rounded-xl border border-navy-300 bg-white px-3 py-1.5 text-[11px] font-bold text-navy-900 shadow-sm transition hover:bg-sand-100"
                      >
                        <Edit3 size={13} /> Sửa
                      </Link>

                      <form action={toggleBrokerVerification.bind(null, broker.id, broker.is_verified)}>
                        <button
                          type="submit"
                          className={`rounded-xl px-2.5 py-1.5 text-[11px] font-bold transition ${
                            broker.is_verified
                              ? 'border border-stone-200 text-stone-500 hover:text-rose-600 hover:border-rose-200'
                              : 'bg-emerald-600 text-white hover:bg-emerald-700'
                          }`}
                        >
                          {broker.is_verified ? 'Hủy' : 'Duyệt'}
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
