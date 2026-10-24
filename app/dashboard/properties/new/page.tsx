import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft, Building2, UploadCloud, ShieldCheck } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { createProperty } from '@/app/actions/brokerage';

export const revalidate = 0;

export default async function NewPropertyPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

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
          Đăng nguồn hàng độc quyền / chọn lọc
        </span>
      </div>

      <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-10">
        <div className="border-b border-stone-100 pb-5">
          <h1 className="text-2xl font-black text-navy-950">Đăng Bất Động Sản Mới</h1>
          <p className="mt-1 text-xs text-stone-500">
            Nguồn hàng sẽ được tự động liên kết với hồ sơ cá nhân của bạn và hiển thị trực tiếp trên sàn.
          </p>
        </div>

        <form action={createProperty} className="mt-8 space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-navy-900">
              Tiêu đề bài đăng *
            </label>
            <input
              type="text"
              name="title"
              required
              placeholder="Ví dụ: Biệt Thự The Suite Aqua City - View Sông Trực Diện"
              className="mt-1.5 w-full rounded-xl border border-stone-200 p-3 text-xs focus:border-champagne-500 focus:outline-none"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy-900">
                Loại hình *
              </label>
              <select
                name="property_type"
                className="mt-1.5 w-full rounded-xl border border-stone-200 p-3 text-xs focus:border-champagne-500 focus:outline-none"
              >
                <option value="Căn hộ">Căn hộ</option>
                <option value="Nhà phố">Nhà phố</option>
                <option value="Biệt thự">Biệt thự</option>
                <option value="Đất nền">Đất nền</option>
                <option value="Kho xưởng">Kho xưởng</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy-900">
                Tỉnh / Thành phố *
              </label>
              <select
                name="city"
                className="mt-1.5 w-full rounded-xl border border-stone-200 p-3 text-xs focus:border-champagne-500 focus:outline-none"
              >
                <option value="Đồng Nai">Đồng Nai</option>
                <option value="TP.HCM">TP.HCM</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy-900">
                Quận / Huyện *
              </label>
              <input
                type="text"
                name="district"
                required
                placeholder="Biên Hòa, Long Thành, Thủ Đức..."
                className="mt-1.5 w-full rounded-xl border border-stone-200 p-3 text-xs focus:border-champagne-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-navy-900">
              Địa chỉ cụ thể *
            </label>
            <input
              type="text"
              name="address"
              required
              placeholder="Số nhà, tên đường, tên dự án, phường/xã..."
              className="mt-1.5 w-full rounded-xl border border-stone-200 p-3 text-xs focus:border-champagne-500 focus:outline-none"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy-900">
                Giá số (Tỷ VNĐ) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0.1"
                name="price"
                required
                placeholder="Ví dụ: 11.8"
                className="mt-1.5 w-full rounded-xl border border-stone-200 p-3 text-xs focus:border-champagne-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy-900">
                Giá hiển thị *
              </label>
              <input
                type="text"
                name="price_display"
                required
                placeholder="11.8 tỷ hoặc 45 triệu/m²"
                className="mt-1.5 w-full rounded-xl border border-stone-200 p-3 text-xs focus:border-champagne-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy-900">
                Diện tích (m²) *
              </label>
              <input
                type="number"
                step="0.1"
                name="area_m2"
                required
                placeholder="Ví dụ: 200"
                className="mt-1.5 w-full rounded-xl border border-stone-200 p-3 text-xs focus:border-champagne-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy-900">Phòng ngủ</label>
              <input
                type="number"
                name="bedrooms"
                defaultValue={3}
                className="mt-1.5 w-full rounded-xl border border-stone-200 p-3 text-xs focus:border-champagne-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy-900">Phòng tắm</label>
              <input
                type="number"
                name="bathrooms"
                defaultValue={2}
                className="mt-1.5 w-full rounded-xl border border-stone-200 p-3 text-xs focus:border-champagne-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy-900">Hướng nhà</label>
              <input
                type="text"
                name="direction"
                defaultValue="Đông Nam"
                className="mt-1.5 w-full rounded-xl border border-stone-200 p-3 text-xs focus:border-champagne-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy-900">Pháp lý</label>
              <input
                type="text"
                name="legal_status"
                defaultValue="Sổ hồng riêng"
                className="mt-1.5 w-full rounded-xl border border-stone-200 p-3 text-xs focus:border-champagne-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-navy-900">
              URL Ảnh đại diện (Cover Image) *
            </label>
            <input
              type="url"
              name="cover_image"
              required
              placeholder="https://images.unsplash.com/... hoặc link ảnh từ Supabase Storage"
              className="mt-1.5 w-full rounded-xl border border-stone-200 p-3 text-xs focus:border-champagne-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-navy-900">
              Mô tả chi tiết sản phẩm
            </label>
            <textarea
              name="description"
              rows={4}
              placeholder="Vị trí tiện ích, hạ tầng đường sá, kết nối giao thông, ưu đãi thanh toán..."
              className="mt-1.5 w-full rounded-xl border border-stone-200 p-3 text-xs focus:border-champagne-500 focus:outline-none leading-relaxed"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_exclusive"
              name="is_exclusive"
              className="h-4 w-4 rounded border-stone-300 text-champagne-600 focus:ring-champagne-500"
            />
            <label htmlFor="is_exclusive" className="text-xs font-bold text-navy-900 cursor-pointer">
              Đánh dấu là Nguồn hàng ĐỘC QUYỀN (Hiển thị nhãn vàng trên thẻ BĐS)
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
            <Link
              href="/dashboard"
              className="rounded-xl border border-stone-200 px-5 py-3 text-xs font-bold text-stone-600 hover:bg-stone-50"
            >
              Hủy bỏ
            </Link>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-champagne-400 to-champagne-600 px-6 py-3 text-xs font-black text-navy-950 shadow-md hover:brightness-105"
            >
              <Building2 size={16} /> ĐĂNG BẤT ĐỘNG SẢN LÊN SÀN
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
