'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function updateBrokerProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Vui lòng đăng nhập.');

  const fullName = String(formData.get('full_name') || '').trim();
  const phone = String(formData.get('phone') || '').trim();
  const zaloPhone = String(formData.get('zalo_phone') || '').trim();
  const avatarUrl = String(formData.get('avatar_url') || '').trim();
  const licenseNumber = String(formData.get('license_number') || '').trim();
  const bio = String(formData.get('bio') || '').trim();
  const experienceYears = Number(formData.get('experience_years') || 0);
  
  // Mảng khu vực & chuyên môn (tách theo dấu phẩy)
  const coverageAreas = String(formData.get('coverage_areas') || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  const specializations = String(formData.get('specializations') || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  if (!fullName || !phone) {
    throw new Error('Họ tên và số điện thoại là bắt buộc.');
  }

  // Cập nhật profile môi giới tương ứng với user_id hiện tại
  const { error } = await supabase
    .from('brokers')
    .update({
      full_name: fullName,
      phone,
      zalo_phone: zaloPhone || phone,
      avatar_url: avatarUrl || null,
      license_number: licenseNumber || null,
      bio,
      experience_years: experienceYears,
      coverage_areas: coverageAreas,
      specializations: specializations,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', user.id);

  if (error) {
    throw new Error(`Cập nhật thất bại: ${error.message}`);
  }

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/profile');
  revalidatePath('/');
}

// Dành cho Admin: Quản lý / Xác thực môi giới
export async function toggleBrokerVerification(brokerId: string, currentStatus: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Yêu cầu đăng nhập.');

  // Kiểm tra quyền admin
  const { data: adminCheck } = await supabase
    .from('brokers')
    .select('is_admin')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!adminCheck?.is_admin && !user.email?.includes('admin')) {
    throw new Error('Bạn không có quyền thực hiện thao tác này.');
  }

  const { error } = await supabase
    .from('brokers')
    .update({ is_verified: !currentStatus })
    .eq('id', brokerId);

  if (error) throw new Error(error.message);

  revalidatePath('/dashboard/brokers');
  revalidatePath('/');
}
