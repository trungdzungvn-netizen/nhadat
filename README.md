# NHÀ ĐẤT KẾT NỐI — Professional Real Estate Brokerage Platform
Hệ thống môi giới bất động sản chuyên nghiệp tại khu vực trọng điểm **TP.HCM & Đồng Nai** xây dựng trên nền tảng **Next.js 14 App Router, TypeScript, Tailwind CSS và Supabase**.

---

## 1. HƯỚNG DẪN KẾT NỐI SUPABASE (DATABASE)

1. Đăng nhập vào [Supabase Dashboard](https://supabase.com).
2. Tạo một Project mới (chọn region gần Việt Nam như **Singapore**).
3. Mở mục **SQL Editor**, nhấn **New query**.
4. Sao chép toàn bộ nội dung file `supabase/schema.sql` dán vào và nhấn **RUN**.
   - Lệnh này sẽ tự động tạo đủ 4 phân hệ: `brokers` (môi giới), `properties` (nguồn hàng), `leads` (khách hàng), `appointments` (lịch hẹn).
   - Đã nạp sẵn dữ liệu thực tế mẫu tại Biên Hòa, Aqua City, Bửu Long, Thủ Đức, Quận 1.
5. Vào **Project Settings** → **API**:
   - Sao chép `Project URL`.
   - Sao chép `Project API anon key`.

---

## 2. CHẠY THỬ NGHIỆM LOCAL

```bash
# Cài đặt thư viện
npm install

# Tạo file môi trường
cp .env.example .env.local
```
Điền 2 giá trị vừa lấy từ Supabase vào `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

Chạy môi trường phát triển:
```bash
npm run dev
```
Mở trình duyệt tại: `http://localhost:3000`

---

## 3. UPLOAD LÊN GITHUB & DEPLOY VERCEL

### Bước A: Đẩy code lên GitHub
```bash
git init
git add .
git commit -m "Khoi tao nen tang Nha Dat Ket Noi chuyen nghiep"
git branch -M main
git remote add origin https://github.com/<tai-khoan-cua-ban>/nhadatketnoi.git
git push -u origin main
```

### Bước B: Triển khai trên Vercel
1. Đăng nhập [Vercel](https://vercel.com) bằng tài khoản GitHub.
2. Chọn **Add New...** → **Project**, chọn repo `nhadatketnoi`.
3. Tại phần **Environment Variables**, thêm 2 biến:
   - `NEXT_PUBLIC_SUPABASE_URL`: (URL của Supabase)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: (Anon key của Supabase)
4. Nhấn **Deploy**. Sau 1-2 phút, website của bạn sẽ hoạt động chính thức trên domain Vercel.
