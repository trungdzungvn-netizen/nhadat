'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Building2, Lock, Mail, ArrowRight } from 'lucide-react';
import { loginUser } from '@/app/actions/auth';

export default function LoginPage() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const formData = new FormData(e.currentTarget);
    try {
      const res = await loginUser(formData);
      if (res?.error) {
        setErrorMsg(res.error);
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Đăng nhập không thành công.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full max-w-md rounded-3xl border border-champagne-200/80 bg-white p-8 shadow-2xl shadow-navy-950/5">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-champagne-400 to-champagne-600 text-navy-950 shadow-md">
            <Building2 size={28} className="stroke-[2.2]" />
          </div>
          <h1 className="mt-4 text-2xl font-black text-navy-950">Đăng Nhập Workspace</h1>
          <p className="mt-1 text-xs text-stone-500">
            Cổng thông tin quản lý nguồn hàng & khách hàng cho Môi giới và Ban quản trị
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-navy-900">Email tài khoản</label>
            <div className="mt-1 flex items-center gap-2 rounded-xl border border-stone-200 bg-sand-50/50 px-3 py-2.5 focus-within:border-champagne-500 focus-within:bg-white">
              <Mail size={16} className="text-stone-400" />
              <input
                type="email"
                name="email"
                required
                placeholder="broker@nhadatketnoi.vn"
                className="w-full bg-transparent text-xs text-navy-950 placeholder-stone-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-navy-900">Mật khẩu</label>
            </div>
            <div className="mt-1 flex items-center gap-2 rounded-xl border border-stone-200 bg-sand-50/50 px-3 py-2.5 focus-within:border-champagne-500 focus-within:bg-white">
              <Lock size={16} className="text-stone-400" />
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                className="w-full bg-transparent text-xs text-navy-950 placeholder-stone-400 focus:outline-none"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-navy-900 py-3 text-xs font-black text-champagne-300 shadow-md transition hover:bg-navy-800 disabled:opacity-50"
          >
            {loading ? 'Đang xác thực...' : 'VÀO WORKSPACE'} <ArrowRight size={14} />
          </button>
        </form>
      </div>
    </div>
  );
}
