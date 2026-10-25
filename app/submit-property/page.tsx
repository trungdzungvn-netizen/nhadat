'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Building2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { submitPropertyForReview } from '@/app/actions/public_submissions';

export default function SubmitPropertyPage() {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const formData = new FormData(e.currentTarget);
    try {
      await submitPropertyForReview(formData);
      setSuccess(true);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-navy-800 hover:text-champagne-600">
          <ArrowLeft size={16} /> Quay lại trang chủ
        </Link>
      </div>

      <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-xl sm:p-10">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-champagne-400 to-champagne-600 text-navy-950 shadow-md">
            <Building2 size={28} className="stroke-[2.2]" />
          </div>
          <h1 className="mt-4 text-2xl font-black text-navy-950 sm:text-3xl">Gửi Bất Động Sản Cần Giao Dịch</h1>
          <p className="mt-2 text-xs text-stone-500 max-w-lg mx-auto leading-relaxed">
            Dành cho Chủ nhà, Nhà đầu tư và Môi giới liên kết. Nguồn hàng gửi lên sẽ được Admin kiểm tra thông tin pháp lý và thẩm định trước khi hiển thị công khai trên sàn.
          </p>
        </div>

        {success ? (
          <div className="my-10 rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
            <CheckCircle2 size={56} className="mx-auto text-emerald-600 animate-bounce" />
            <h3 className="mt-4 text-lg font-black text-navy-950">Gửi thông tin bất động sản thành công!</h3>
            <p className="mt-2 text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
              Sản phẩm đang ở trạng thái <strong>Chờ Admin kiểm duyệt</strong>. Chuyên viên quản lý khu vực sẽ liên hệ để xác nhận pháp lý, hỗ trợ hình ảnh và duyệt tin lên vị trí nổi bật.
            </p>
            <div className="mt-6">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-xl bg-navy-900 px-6 py-3 text-xs font-black text-champagne-300 shadow-md hover:bg-navy-800"
              >
                Khám phá các sản phẩm khác
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <input type="text" name="b_trap" className="hidden" tabIndex={-1} autoComplete="off" />

            <div className="rounded-2xl bg-sand-100 p-4">
              <p className="text-xs font-bold text-navy-950 uppercase tracking-wider">
                1. Thông tin người gửi (Chính chủ / Môi giới liên kết)
              </p>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-navy-900">Họ và tên người gửi *</label>
                  <input
                    type="text"
                    name="contact_name"
                    required
                    placeholder="Ví dụ: Nguyễn Văn Nam"
                    className="mt-1 w-full rounded-xl border border-stone-200 bg-white p-3 text-xs focus:border-champagne-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-navy-900">Số điện thoại liên hệ *</label>
                  <input
                    type="tel"
                    name="contact_phone"
                    required
                    placeholder="0912 345 678"
                    className="mt-1 w-full rounded-xl border border-stone-200 bg-white p-3 text-xs focus:border-champagne-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-navy-950 uppercase tracking-wider mb-3">
                2. Chi tiết bất động sản cần giao dịch
              </p>

              <label className="block text-xs font-bold uppercase tracking-wider text-navy-900">
                Tiêu đề bất động sản *
              </label>
              <input
                type="text"
                name="title"
                required
                placeholder="Ví dụ: Căn hộ 2PN King Crown Infinity Võ Văn Ngân, View Sài Gòn"
                className="mt-1.5 w-full rounded-xl border border-stone-200 p-3 text-xs focus:border-champagne-500 focus:outline-none"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy-900">
                  Loại hình BĐS *
                </label>
                <select
                  name="property_type"
                  className="mt-1.5 w-full rounded-xl border border-stone-200 p-3 text-xs focus:border-champagne-500 focus:outline-none"
                >
                  <option value="Nhà phố">Nhà phố</option>
                  <option value="Căn hộ">Căn hộ</option>
                  <option value="Biệt thự">Biệt thự</option>
                  <option value="Đất nền">Đất nền</option>
                  <option value="Kho xưởng">Kho xưởng</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy-900">
                  Khu vực Tỉnh / TP *
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
                Địa chỉ chi tiết bất động sản *
              </label>
              <input
                type="text"
                name="address"
                required
                placeholder="Số nhà, đường, phường/xã, khu dân cư..."
                className="mt-1.5 w-full rounded-xl border border-stone-200 p-3 text-xs focus:border-champagne-500 focus:outline-none"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy-900">
                  Giá bán kỳ vọng (Tỷ VNĐ) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.1"
                  name="price"
                  required
                  placeholder="Ví dụ: 4.8"
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
                  placeholder="Ví dụ: 4.8 tỷ hoặc 38 triệu/m²"
                  className="mt-1.5 w-full rounded-xl border border-stone-200 p-3 text-xs focus:border-champagne-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy-900">
                  Diện tích đất/sàn (m²) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="area_m2"
                  required
                  placeholder="Ví dụ: 120"
                  className="mt-1.5 w-full rounded-xl border border-stone-200 p-3 text-xs focus:border-champagne-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy-900">Số phòng ngủ</label>
                <input
                  type="number"
                  name="bedrooms"
                  defaultValue={3}
                  className="mt-1.5 w-full rounded-xl border border-stone-200 p-3 text-xs focus:border-champagne-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy-900">Số phòng tắm</label>
                <input
                  type="number"
                  name="bathrooms"
                  defaultValue={2}
                  className="mt-1.5 w-full rounded-xl border border-stone-200 p-3 text-xs focus:border-champagne-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy-900">Tình trạng pháp lý</label>
                <input
                  type="text"
                  name="legal_status"
                  defaultValue="Sổ hồng riêng"
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
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy-900">
                Link hình ảnh thực tế (URL)
              </label>
              <input
                type="url"
                name="cover_image"
                placeholder="https://images.unsplash.com/... hoặc link ảnh Google Drive/Cloud"
                className="mt-1.5 w-full rounded-xl border border-stone-200 p-3 text-xs focus:border-champagne-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy-900">
                Mô tả chi tiết và các ưu điểm nổi bật
              </label>
              <textarea
                name="description"
                rows={4}
                placeholder="Tiện ích xung quanh, đường trước nhà mấy mét, hiện đang cho thuê hay để trống..."
                className="mt-1.5 w-full rounded-xl border border-stone-200 p-3 text-xs focus:border-champagne-500 focus:outline-none leading-relaxed"
              ></textarea>
            </div>

            {errorMsg && (
              <p className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-bold text-rose-700">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-champagne-400 to-champagne-600 py-3.5 text-xs font-black text-navy-950 shadow-md transition hover:brightness-105 disabled:opacity-50"
            >
              {loading ? 'Đang gửi thông tin...' : 'GỬI BẤT ĐỘNG SẢN (CHỜ ADMIN DUYỆT)'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
