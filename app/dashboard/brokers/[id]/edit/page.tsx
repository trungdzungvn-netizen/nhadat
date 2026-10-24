import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Save, ShieldCheck, UserCheck } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { adminUpdateBroker } from '@/app/actions/broker';
import type { Broker } from '@/types';

export const revalidate = 0;

export default async function EditBrokerPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Lấy dữ liệu broker cần sửa
  const { data, error } = await supabase
    .from('brokers')
    .select('*')
    .eq('id', params.id)
    .maybeSingle();

  if (error || !data) {
    notFound();
  }

  const broker = data as Broker & { is_admin?: boolean };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/dashboard/brokers"
          className="flex items-center gap-1.5 text-xs font-bold text-navy-800 hover:text-champagne-600"
        >
          <ArrowLeft size={16} /> Quay lại Danh sách Môi giới
        </Link>
        <span className="rounded-full bg-sand-200 px-3 py-1 text-[11px] font-semibold text-navy-950">
          Chỉnh sửa hồ sơ ID: {broker.id.slice(0, 8)}...
        </span>
      </div>

      <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-10">
        <div className="flex items-center gap-4 border-b border-stone-100 pb-6">
          <div className="relative h-16 w-16 overflow-hidden rounded-2xl border-2 border-champagne-400 bg-navy-900 shadow-md">
            <Image
              src={broker.avatar_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80'}
              alt={broker.full_name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h1 className="text-xl font-black text-navy-950">Chỉnh Sửa Thông Tin Môi Giới</h1>
            <p className="mt-0.5 text-xs text-stone-500">
              Cập nhật số điện thoại, avatar, địa bàn phụ trách và trạng thái xác thực.
            </p>
          </div>
        </div>

        <form action={adminUpdateBroker} className="mt-8 space-y-6">
          <input type="hidden" name="broker_id" value={broker.id} />

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy-900">
                Họ và tên *
              </label>
              <input
                type="text"
                name="full_name"
                required
                defaultValue={broker.full_name}
                className="mt-1.5 w-full rounded-xl border border-stone-200 p-3 text-xs focus:border-champagne-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy-900">
                Số chứng chỉ hành nghề (CCHN)
              </label>
              <input
                type="text"
                name="license_number"
                defaultValue={broker.license_number || ''}
                placeholder="CCHN-ĐN-01928"
                className="mt-1.5 w-full rounded-xl border border-stone-200 p-3 text-xs focus:border-champagne-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy-900">
                Số điện thoại liên hệ *
              </label>
              <input
                type="tel"
                name="phone"
                required
                defaultValue={broker.phone}
                className="mt-1.5 w-full rounded-xl border border-stone-200 p-3 text-xs focus:border-champagne-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy-900">
                Số Zalo tư vấn
              </label>
              <input
                type="tel"
                name="zalo_phone"
                defaultValue={broker.zalo_phone || broker.phone}
                className="mt-1.5 w-full rounded-xl border border-stone-200 p-3 text-xs focus:border-champagne-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy-900">
                Số năm kinh nghiệm
              </label>
              <input
                type="number"
                name="experience_years"
                min="0"
                max="50"
                defaultValue={broker.experience_years ?? 3}
                className="mt-1.5 w-full rounded-xl border border-stone-200 p-3 text-xs focus:border-champagne-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy-900">
                Link ảnh đại diện (Avatar URL) *
              </label>
              <input
                type="url"
                name="avatar_url"
                defaultValue={broker.avatar_url || ''}
                placeholder="https://images.unsplash.com/... hoặc link ảnh Supabase Storage"
                className="mt-1.5 w-full rounded-xl border border-stone-200 p-3 text-xs focus:border-champagne-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-navy-900">
              Địa bàn / Khu vực phụ trách (phân cách bằng dấu phẩy) *
            </label>
            <input
              type="text"
              name="coverage_areas"
              required
              defaultValue={broker.coverage_areas?.join(', ') || ''}
              placeholder="Biên Hòa, Long Hưng, Tam Phước, Thủ Đức, Quận 1"
              className="mt-1.5 w-full rounded-xl border border-stone-200 p-3 text-xs focus:border-champagne-500 focus:outline-none"
            />
            <p className="mt-1 text-[11px] text-stone-400">
              Ví dụ: Biên Hòa, Long Hưng, Long Thành, TP. Thủ Đức, Quận 7
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-navy-900">
              Phân khúc chuyên môn (phân cách bằng dấu phẩy)
            </label>
            <input
              type="text"
              name="specializations"
              defaultValue={broker.specializations?.join(', ') || ''}
              placeholder="Căn hộ cao cấp, Biệt thự ven sông, Nhà phố thương mại, Đất nền"
              className="mt-1.5 w-full rounded-xl border border-stone-200 p-3 text-xs focus:border-champagne-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-navy-900">
              Giới thiệu bản thân & Cam kết khách hàng
            </label>
            <textarea
              name="bio"
              rows={4}
              defaultValue={broker.bio || ''}
              className="mt-1.5 w-full rounded-xl border border-stone-200 p-3 text-xs focus:border-champagne-500 focus:outline-none leading-relaxed"
            />
          </div>

          {/* CÁC QUYỀN VÀ TRẠNG THÁI */}
          <div className="flex flex-wrap gap-6 rounded-2xl bg-sand-100 p-4">
            <label className="flex items-center gap-2 text-xs font-bold text-navy-950 cursor-pointer">
              <input
                type="checkbox"
                name="is_verified"
                defaultChecked={broker.is_verified}
                className="h-4 w-4 rounded border-stone-300 text-champagne-600 focus:ring-champagne-500"
              />
              Huy hiệu Xác thực uy tín (Tích xanh)
            </label>

            <label className="flex items-center gap-2 text-xs font-bold text-navy-950 cursor-pointer">
              <input
                type="checkbox"
                name="is_admin"
                defaultChecked={Boolean(broker.is_admin)}
                className="h-4 w-4 rounded border-stone-300 text-rose-600 focus:ring-rose-500"
              />
              Cấp quyền Quản trị viên (Admin)
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
            <Link
              href="/dashboard/brokers"
              className="rounded-xl border border-stone-200 px-5 py-3 text-xs font-bold text-stone-600 hover:bg-stone-50"
            >
              Hủy bỏ
            </Link>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-champagne-400 to-champagne-600 px-6 py-3 text-xs font-black text-navy-950 shadow-md hover:brightness-105"
            >
              <Save size={15} /> LƯU THÔNG TIN
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
