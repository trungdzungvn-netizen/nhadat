'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, UserPlus, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { registerBroker } from '@/app/actions/public_submissions';

export default function RegisterBrokerPage() {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const formData = new FormData(e.currentTarget);
    try {
      await registerBroker(formData);
      setSuccess(true);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-navy-800 hover:text-champagne-600">
          <ArrowLeft size={16} /> Quay lại trang chủ
        </Link>
      </div>

      <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-xl sm:p-10">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-champagne-400 to-champagne-600 text-navy-950 shadow-md">
            <UserPlus size={28} className="stroke-[2.2]" />
          </div>
          <h1 className="mt-4 text-2xl font-black text-navy-950 sm:text-3xl">Đăng Ký Thành Viên Môi Giới</h1>
          <p className="mt-2 text-xs text-stone-500 max-w-lg mx-auto leading-relaxed">
            Gia nhập mạng lưới môi giới chuyên nghiệp tại <strong>TP.HCM & Đồng Nai</strong>. Tiếp cận nguồn hàng độc quyền, nhận khách hàng tiềm năng và được hỗ trợ pháp lý 100%.
          </p>
        </div>

        {success ? (
          <div className="my-10 rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
            <CheckCircle2 size={56} className="mx-auto text-emerald-600 animate-bounce" />
            <h3 className="mt-4 text-lg font-black text-navy-950">Gửi hồ sơ đăng ký thành công!</h3>
            <p className="mt-2 text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
              Hồ sơ của bạn đã được chuyển đến <strong>Ban Quản Trị Nhà Đất Kết Nối</strong>. Chúng tôi sẽ liên hệ phỏng vấn/xác thực chứng chỉ và duyệt tài khoản trong vòng 24 giờ.
            </p>
            <div className="mt-6">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-xl bg-navy-900 px-6 py-3 text-xs font-black text-champagne-300 shadow-md hover:bg-navy-800"
              >
                Về trang chủ
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <input type="text" name="b_trap" className="hidden" tabIndex={-1} autoComplete="off" />

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy-900">
                  Họ và tên chuyên viên *
                </label>
                <input
                  type="text"
                  name="full_name"
                  required
                  placeholder="Ví dụ: Trần Quốc Huy"
                  className="mt-1.5 w-full rounded-xl border border-stone-200 p-3 text-xs focus:border-champagne-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy-900">
                  Số điện thoại di động *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
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
                  placeholder="Để khách hàng kết nối trực tiếp"
                  className="mt-1.5 w-full rounded-xl border border-stone-200 p-3 text-xs focus:border-champagne-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy-900">
                  Số chứng chỉ hành nghề (nếu có)
                </label>
                <input
                  type="text"
                  name="license_number"
                  placeholder="CCHN-ĐN-xxxxx hoặc CCHN-HCM-xxxxx"
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
                  max="40"
                  defaultValue={2}
                  className="mt-1.5 w-full rounded-xl border border-stone-200 p-3 text-xs focus:border-champagne-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy-900">
                  Link ảnh chân dung (Avatar)
                </label>
                <input
                  type="url"
                  name="avatar_url"
                  placeholder="https://... (ảnh sắc nét để tạo hồ sơ uy tín)"
                  className="mt-1.5 w-full rounded-xl border border-stone-200 p-3 text-xs focus:border-champagne-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy-900">
                Địa bàn hoạt động mạnh nhất * (phân cách bằng dấu phẩy)
              </label>
              <input
                type="text"
                name="coverage_areas"
                required
                placeholder="Ví dụ: TP. Biên Hòa, Huyện Long Thành, KĐT Aqua City, TP. Thủ Đức"
                className="mt-1.5 w-full rounded-xl border border-stone-200 p-3 text-xs focus:border-champagne-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy-900">
                Phân khúc chuyên sâu (phân cách bằng dấu phẩy)
              </label>
              <input
                type="text"
                name="specializations"
                placeholder="Ví dụ: Căn hộ cao cấp, Đất nền dự án, Nhà phố thương mại"
                className="mt-1.5 w-full rounded-xl border border-stone-200 p-3 text-xs focus:border-champagne-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy-900">
                Giới thiệu kinh nghiệm và cam kết với khách hàng
              </label>
              <textarea
                name="bio"
                rows={3}
                placeholder="Ví dụ: Hơn 5 năm đồng hành tư vấn pháp lý và định giá các dự án ven sông Đồng Nai..."
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
              {loading ? 'Đang gửi hồ sơ...' : 'GỬI ĐĂNG KÝ (CHỜ ADMIN DUYỆT)'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
