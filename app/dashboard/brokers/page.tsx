import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, ShieldAlert, Award, Phone, CheckCircle, XCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { toggleBrokerVerification } from '@/app/actions/broker';
import type { Broker } from '@/types';

export const revalidate = 0;

export default async function AdminBrokersListPage() {
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

  const brokersList = (brokers || []) as Broker[];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
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

      <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
        <div className="border-b border-stone-100 pb-4">
          <h1 className="text-xl font-black text-navy-950">Danh Sách Môi Giới Toàn Hệ Thống ({brokersList.length})</h1>
          <p className="mt-1 text-xs text-stone-500">
            Kiểm duyệt hồ sơ, xác thực chứng chỉ hành nghề (CCHN) và phân quyền hoạt động.
          </p>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-xs text-navy-950">
            <thead className="bg-sand-100 text-[11px] uppercase tracking-wider text-stone-600">
              <tr>
                <th className="p-3.5 rounded-l-xl">Môi giới</th>
                <th className="p-3.5">Liên hệ</th>
                <th className="p-3.5">Khu vực phụ trách</th>
                <th className="p-3.5">Chứng chỉ (CCHN)</th>
                <th className="p-3.5">Trạng thái</th>
                <th className="p-3.5 rounded-r-xl text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {brokersList.map((broker) => (
                <tr key={broker.id} className="hover:bg-sand-50/60">
                  <td className="p-3.5">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-champagne-400 bg-navy-900">
                        <Image
                          src={broker.avatar_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80'}
                          alt={broker.full_name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-navy-950">{broker.full_name}</p>
                        <p className="text-[11px] text-stone-400">{broker.experience_years} năm KN · {broker.rating}★</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <p className="font-semibold">{broker.phone}</p>
                    <p className="text-[11px] text-stone-400">Zalo: {broker.zalo_phone || broker.phone}</p>
                  </td>
                  <td className="p-3.5">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {broker.coverage_areas?.slice(0, 3).map((a) => (
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
                    <form action={toggleBrokerVerification.bind(null, broker.id, broker.is_verified)}>
                      <button
                        type="submit"
                        className={`rounded-xl px-3 py-1.5 text-[11px] font-bold transition ${
                          broker.is_verified
                            ? 'border border-stone-200 text-stone-600 hover:bg-rose-50 hover:text-rose-600'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700'
                        }`}
                      >
                        {broker.is_verified ? 'Hủy xác thực' : 'Duyệt xác thực'}
                      </button>
                    </form>
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
