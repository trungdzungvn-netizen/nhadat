'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

// ĐĂNG NHẬP
export async function loginUser(formData: FormData) {
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');

  if (!email || !password) {
    return { error: 'Vui lòng điền đầy đủ Email và Mật khẩu.' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: 'Tài khoản hoặc mật khẩu không chính xác.' };
  }

  return { success: true };
}

// ĐĂNG KÝ TÀI KHOẢN MÔI GIỚI MỚI (TỰ ĐỘNG TẠO AUTH + LIÊN KẾT PROFILE BROKER)
export async function registerBrokerAccount(formData: FormData) {
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');
  const fullName = String(formData.get('full_name') || '').trim();
  const phone = String(formData.get('phone') || '').trim();
  const zaloPhone = String(formData.get('zalo_phone') || '').trim() || phone;
  const coverageAreas = String(formData.get('coverage_areas') || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
  const licenseNumber = String(formData.get('license_number') || '').trim();
  const experienceYears = Number(formData.get('experience_years') || 1);

  if (!email || !password || !fullName || !phone) {
    return { error: 'Vui lòng điền đầy đủ các thông tin bắt buộc.' };
  }

  if (password.length < 6) {
    return { error: 'Mật khẩu phải có ít nhất 6 ký tự.' };
  }

  const supabase = await createClient();

  // 1. Tạo tài khoản trong Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError || !authData.user) {
    return { error: authError?.message || 'Không thể tạo tài khoản.' };
  }

  // 2. Tạo bản ghi hồ sơ môi giới tương ứng
  const { error: profileError } = await supabase.from('brokers').insert({
    user_id: authData.user.id,
    email: email,
    full_name: fullName,
    phone: phone,
    zalo_phone: zaloPhone,
    license_number: licenseNumber || null,
    experience_years: experienceYears,
    coverage_areas: coverageAreas.length > 0 ? coverageAreas : ['Biên Hòa', 'Đồng Nai'],
    specializations: ['Căn hộ', 'Nhà phố', 'Đất nền'],
    status: 'pending', // Chờ Admin phê duyệt hồ sơ
    is_verified: false,
    rating: 5.0,
    avatar_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    bio: 'Chuyên viên tư vấn bất động sản chuyên nghiệp tại khu vực TP.HCM - Đồng Nai.',
  });

  if (profileError) {
    return { error: `Đăng ký thành công nhưng lỗi tạo hồ sơ: ${profileError.message}` };
  }

  return { success: true };
}

// ĐĂNG XUẤT
export async function logoutUser() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
