import Link from 'next/link';
import { ShieldCheck, PhoneCall, Building2, UserCircle2 } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-navy-800 bg-navy-950/95 text-white backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-champagne-400 to-champagne-600 text-navy-950 shadow-md">
            <Building2 size={24} className="stroke-[2.2]" />
          </div>
          <div>
            <span className="text-lg font-black tracking-wider text-white">NHÀ ĐẤT KẾT NỐI</span>
            <span className="block text-[10px] uppercase tracking-widest text-champagne-400 font-semibold">
              Bất động sản TP.HCM & Đồng Nai
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          <Link href="/?city=Đồng Nai" className="transition hover:text-champagne-400">
            Khu vực Đồng Nai
          </Link>
          <Link href="/?city=TP.HCM" className="transition hover:text-champagne-400">
            Khu vực TP.HCM
          </Link>
          <Link href="/#brokers" className="transition hover:text-champagne-400">
            Môi giới uy tín
          </Link>
          <Link href="/dashboard" className="flex items-center gap-1.5 text-champagne-400 transition hover:text-champagne-300">
            <ShieldCheck size={16} /> Dành cho môi giới
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="tel:0908889999"
            className="hidden items-center gap-2 rounded-full border border-champagne-400/40 bg-navy-900 px-4 py-2 text-xs font-bold text-champagne-300 transition hover:border-champagne-400 sm:inline-flex"
          >
            <PhoneCall size={14} /> Hotline: 0908.889.999
          </a>
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-champagne-400 to-champagne-500 px-4 py-2 text-xs font-black text-navy-950 shadow-md transition hover:brightness-105"
          >
            <UserCircle2 size={16} /> Workspace
          </Link>
        </div>
      </div>
    </header>
  );
}
