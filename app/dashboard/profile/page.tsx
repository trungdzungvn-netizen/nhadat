import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Award, ArrowLeft, Save, MapPin, Briefcase } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { updateBrokerProfile } from '@/app/actions/broker';
import type { Broker } from '@/types';

export const revalidate = 0;

export default async function BrokerProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data } = await supabase
    .from('brokers')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  const broker = data as Broker | null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 text-xs font-bold text-navy-800 hover:text-champagne-600"
        >
          <ArrowLeft size={16} /> Quay lại Workspace
        </Link>
        <span className="text-xs text-stone-500">
          Tài khoản: <strong>{user.email}</strong>
        </span>
      </div>

      <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-10">
        <div className="flex items-center justify-between border-b border-stone-100 pb-6">
          <div>
            <h1 className="text-2xl font-black text-navy-950">Hồ Sơ Chuyên Viên Môi Giới</h1>
            <p className="mt-1 text-xs text-stone-500">
              Thông tin này sẽ hiển thị trực tiếp trên trang chi tiết sản phẩm và hồ sơ công khai của bạn.
            </p>
          </div>
          {broker?.is_verified && (
            <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
              <ShieldCheck size={16} className="text-emerald-600" /> Đã xác thực
            </div>
          )}
        </div>

        <form action={updateBrokerProfile} className="mt-8 space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy-900">
                Họ và tên *
              </label>
              <input
                type="text"
                name="full_name"
                required
                defaultValue={broker?.full_name || ''}
                placeholder="Nguyễn Văn A"
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
                defaultValue={broker?.license_number || ''}
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
                defaultValue={broker?.phone || ''}
                placeholder="0918 123 456"
                className="mt-1.5 w-full rounded-xl border border-stone-200 p-3 text-xs focus:border-champagne-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy-900">
                Số điện thoại Zalo
              </label>
              <input
                type="tel"
                name="zalo_phone"
                defaultValue={broker?.zalo_phone || broker?.phone || ''}
                placeholder="0918 123 456"
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
                defaultValue={broker?.experience_years ?? 3}
                className="mt-1.5 w-full rounded-xl border border-stone-200 p-3 text-xs focus:border-champagne-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy-900">
                URL ảnh đại diện (Avatar)
              </label>
              <input
                type="url"
                name="avatar_url"
                defaultValue={broker?.avatar_url || ''}
                placeholder="https://images.unsplash.com/..."
                className="mt-1.5 w-full rounded-xl border border-stone-200 p-3 text-xs focus:border-champagne-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-navy-900">
              Khu vực phụ trách trọng điểm (cách nhau bởi dấu phẩy)
            </label>
            <input
              type="text"
              name="coverage_areas"
              defaultValue={broker?.coverage_areas?.join(', ') || 'Biên Hòa, Long Thành, Thủ Đức'}
              placeholder="Biên Hòa, Long Hưng, Tam Phước, Thủ Đức"
              className="mt-1.5 w-full rounded-xl border border-stone-200 p-3 text-xs focus:border-champagne-500 focus:outline-none"
            />
            <p className="mt-1 text-[11px] text-stone-400">Ví dụ: Biên Hòa, Long Hưng, TP. Thủ Đức, Quận 1</p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-navy-900">
              Phân khúc chuyên môn (cách nhau bởi dấu phẩy)
            </label>
            <input
              type="text"
              name="specializations"
              defaultValue={broker?.specializations?.join(', ') || 'Căn hộ cao cấp, Biệt thự ven sông, Nhà phố'}
              placeholder="Căn hộ cao cấp, Nhà phố thương mại, Đất nền sổ sẵn"
              className="mt-1.5 w-full rounded-xl border border-stone-200 p-3 text-xs focus:border-champagne-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-navy-900">
              Giới thiệu bản thân & Triết lý tư vấn
            </label>
            <textarea
              name="bio"
              rows={4}
              defaultValue={broker?.bio || ''}
              placeholder="Chia sẻ kinh nghiệm, cam kết pháp lý và định giá chuẩn cho khách hàng..."
              className="mt-1.5 w-full rounded-xl border border-stone-200 p-3 text-xs focus:border-champagne-500 focus:outline-none leading-relaxed"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
            <Link
              href="/dashboard"
              className="rounded-xl border border-stone-200 px-5 py-3 text-xs font-bold text-stone-600 hover:bg-stone-50"
            >
              Hủy
            </Link>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-champagne-400 to-champagne-600 px-6 py-3 text-xs font-black text-navy-950 shadow-md hover:brightness-105"
            >
              <Save size={15} /> LƯU THAY ĐỔI
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
