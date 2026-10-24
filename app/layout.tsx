import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Nhà Đất Kết Nối | Nền Tảng Môi Giới Bất Động Sản Chuyên Nghiệp',
  description: 'Hệ thống kết nối nguồn hàng chuẩn, môi giới xác thực và dịch vụ tư vấn đầu tư bất động sản tại TP.HCM & Đồng Nai.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="scroll-smooth">
      <body className="bg-sand-50 text-navy-950 antialiased selection:bg-champagne-300 selection:text-navy-950">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
