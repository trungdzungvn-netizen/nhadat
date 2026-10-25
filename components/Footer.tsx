import Link from 'next/link';
import { Building2, MapPin, Phone, Mail, ShieldCheck, UserPlus, Send } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-navy-800 bg-navy-950 text-white">
      {/* KHỐI BOTTOM CALL-TO-ACTION: ĐĂNG KÝ MÔI GIỚI & GỬI BẤT ĐỘNG SẢN */}
      <div className="border-b border-navy-800/80 bg-navy-900/60 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6">
          <div className="text-center sm:text-left">
            <h3 className="text-base font-black text-white sm:text-lg">
              Đồng Hành Cùng Mạng Lưới Bất Động Sản Chuyên Nghiệp
            </h3>
            <p className="mt-1 text-xs text-stone-400">
              Đăng ký tham gia đội ngũ môi giới hoặc gửi sản phẩm cần giao dịch để Admin thẩm định duyệt sàn.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/register-broker"
              className="inline-flex items-center gap-2 rounded-full border border-champagne-400/40 bg-navy-950 px-5 py-3 text-xs font-bold text-champagne-300 shadow-md transition hover:border-champagne-400 hover:bg-navy-900"
            >
              <UserPlus size={16} className="text-champagne-400" /> Đăng Ký Thành Viên Môi Giới
            </Link>
            <Link
              href="/submit-property"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-champagne-400 to-champagne-600 px-5 py-3 text-xs font-black text-navy-950 shadow-md transition hover:brightness-105"
            >
              <Send size={15} /> Gửi Bất Động Sản Cần Giao Dịch
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-champagne-400 text-navy-950 font-bold">
                <Building2 size={20} />
              </div>
              <span className="text-base font-black tracking-wider text-white">NHÀ ĐẤT KẾT NỐI</span>
            </div>
            <p className="text-xs leading-relaxed text-stone-400">
              Nền tảng môi giới bất động sản chuyên nghiệp, xác thực nguồn hàng, bảo vệ quyền lợi người mua và hỗ trợ môi giới kết nối giao dịch thành công.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-champagne-400">Thị trường trọng điểm</h3>
            <ul className="mt-4 space-y-2 text-xs text-stone-400">
              <li><Link href="/?city=Đồng Nai&district=Biên Hòa" className="hover:text-white">TP. Biên Hòa (Đồng Nai)</Link></li>
              <li><Link href="/?city=Đồng Nai&district=Long Thành" className="hover:text-white">Huyện Long Thành - Sân Bay</Link></li>
              <li><Link href="/?city=Đồng Nai&district=Nhơn Trạch" className="hover:text-white">Nhơn Trạch kết nối Cát Lái</Link></li>
              <li><Link href="/?city=TP.HCM&district=Thủ Đức" className="hover:text-white">TP. Thủ Đức (TP.HCM)</Link></li>
              <li><Link href="/?city=TP.HCM&district=Quận 1" className="hover:text-white">Khu Đông & Trung tâm TP.HCM</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-champagne-400">Quy chuẩn dịch vụ</h3>
            <ul className="mt-4 space-y-2 text-xs text-stone-400">
              <li className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-champagne-400" /> Xác thực pháp lý 100%</li>
              <li className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-champagne-400" /> Giá chuẩn chính chủ</li>
              <li className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-champagne-400" /> Hỗ trợ vay ngân hàng lãi tốt</li>
              <li className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-champagne-400" /> Hợp đồng công chứng an toàn</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-champagne-400">Văn phòng đại diện</h3>
            <div className="mt-4 space-y-3 text-xs text-stone-400">
              <p className="flex items-start gap-2">
                <MapPin size={15} className="mt-0.5 shrink-0 text-champagne-400" />
                Trụ sở: Đường Đồng Khởi, Phường Tân Hiệp, TP. Biên Hòa, Đồng Nai
              </p>
              <p className="flex items-center gap-2">
                <Phone size={15} className="shrink-0 text-champagne-400" />
                Hotline tư vấn: 0908.889.999
              </p>
              <p className="flex items-center gap-2">
                <Mail size={15} className="shrink-0 text-champagne-400" />
                Email: lienhe@nhadatketnoi.vn
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-navy-900 pt-6 text-center text-xs text-stone-500">
          © {new Date().getFullYear()} Nhà Đất Kết Nối. Professional Real Estate Brokerage. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
