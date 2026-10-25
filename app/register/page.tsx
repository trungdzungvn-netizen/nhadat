'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Building2, UserPlus, Lock, Mail, Phone, CheckCircle2, ArrowRight } from 'lucide-react';
import { registerBrokerAccount } from '@/app/actions/auth';

export default function RegisterBrokerAccountPage() {
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const formData = new FormData(e.currentTarget);
    try {
      const res = await registerBrokerAccount(formData);
      if (res?.error) {
        setErrorMsg(res.error);
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Đăng ký không thành công.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full max-w-xl rounded-3xl border border-champagne-200/80 bg-white p-8 shadow-2xl shadow-navy-950/5 sm:p-10">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-champagne-400 to-champagne-600 text-navy-950 shadow-md">
            <UserPlus size={28} className="stroke-[2.2]" />
          </div>
          <h1 className="mt-4 text-2xl font-black text-navy-950 sm:text-3xl">Tạo Tài Khoản Môi Giới</h1>
          <p className="mt-1.5 text-xs text-stone-500 max-w-md mx-auto">
            Đăng ký tài khoản thành viên để đăng nhập Workspace quản lý thông tin, giỏ hàng BĐS và khách hàng.
          </p>
        </div>

        {success ? (
          <div className="my-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
            <CheckCircle2 size={52} className="mx-auto text-emerald-600 animate-bounce" />
            <h3 className="mt-3 text-lg font-black text-navy-950">Tạo tài khoản thành công!</h3>
            <p className="mt-2 text-xs text-stone-600 leading-relaxed">
              Tài khoản của bạn đã được ghi nhận với trạng thái <strong>Chờ Admin phê duyệt hồ sơ</strong>. 
              Bạn có thể đăng nhập ngay vào Workspace để theo dõi tiến độ duyệt.
            </p>
            <div className="mt-6">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-xl bg-navy-900 px-6 py-3 text-xs font-black text-champagne-300 shadow-md hover:bg-navy-800"
              >
                Đăng nhập Workspace ngay <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy-900">Email đăng nhập *</label>
                <div className="mt-1 flex items-center gap-2 rounded-xl border border-stone-200 bg-sand-50/50 px-3 py-2.5 focus-within:border-champagne-500 focus-within:bg-white">
                  <Mail size={16} className="text-stone-400" />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="broker@nhadatketnoi.vn"
                    className="w-full bg-transparent text-xs text-navy-950 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy-900">Mật khẩu (ít nhất 6 ký tự) *</label>
                <div className="mt-1 flex items-center gap-2 rounded-xl border border-stone-200 bg-sand-50/50 px-3 py-2.5 focus-within:border-champagne-500 focus-within:bg-white">
                  <Lock size={16} className="text-stone-400" />
                  <input
                    type="password"
                    name="password"
                    required
                    minLength={6}
                    placeholder="••••••••"
                    className="w-full bg-transparent text-xs text-navy-950 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy-900">Họ và tên *</label>
                <input
                  type="text"
                  name="full_name"
                  required
                  placeholder="Ví dụ: Nguyễn Văn An"
                  className="mt-1 w-full rounded-xl border border-stone-200 bg-sand-50/50 p-2.5 text-xs text-navy-950 focus:border-champagne-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy-900">Số điện thoại *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="0918 123 456"
                  className="mt-1 w-full rounded-xl border border-stone-200 bg-sand-50/50 p-2.5 text-xs text-navy-950 focus:border-champagne-500 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy-900">Số Zalo liên hệ</label>
                <input
                  type="tel"
                  name="zalo_phone"
                  placeholder="Để khách hàng chat Zalo"
                  className="mt-1 w-full rounded-xl border border-stone-200 bg-sand-50/50 p-2.5 text-xs text-navy-950 focus:border-champagne-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy-900">Số chứng chỉ hành nghề (CCHN)</label>
                <input
                  type="text"
                  name="license_number"
                  placeholder="CCHN-ĐN-xxxxx (nếu có)"
                  className="mt-1 w-full rounded-xl border border-stone-200 bg-sand-50/50 p-2.5 text-xs text-navy-950 focus:border-champagne-500 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy-900">Địa bàn phụ trách chính *</label>
              <input
                type="text"
                name="coverage_areas"
                required
                placeholder="Ví dụ: TP. Biên Hòa, Huyện Long Thành, KĐT Aqua City, TP. Thủ Đức"
                className="mt-1 w-full rounded-xl border border-stone-200 bg-sand-50/50 p-2.5 text-xs text-navy-950 focus:border-champagne-500 focus:bg-white focus:outline-none"
              />
            </div>

            {errorMsg && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-champagne-400 to-champagne-600 py-3 text-xs font-black text-navy-950 shadow-md transition hover:brightness-105 disabled:opacity-50"
            >
              {loading ? 'Đang tạo tài khoản...' : 'HOÀN TẤT ĐĂNG KÝ MÔI GIỚI'}
            </button>

            <div className="pt-4 text-center text-xs text-stone-500 border-t border-stone-100">
              Đã có tài khoản môi giới?{' '}
              <Link href="/login" className="font-bold text-navy-950 hover:text-champagne-600 underline">
                Đăng nhập Workspace tại đây
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
