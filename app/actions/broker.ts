'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

// 1. MÔI GIỚI TỰ CẬP NHẬT HỒ SƠ CÁ NHÂN (/dashboard/profile)
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

  const coverageAreas = String(formData.get('coverage_areas') || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const specializations = String(formData.get('specializations') || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  if (!fullName || !phone) {
    throw new Error('Họ tên và số điện thoại là bắt buộc.');
  }

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

// 2. ADMIN CẬP NHẬT THÔNG TIN MÔI GIỚI (/dashboard/brokers/[id]/edit)
export async function adminUpdateBroker(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const brokerId = String(formData.get('broker_id') || '').trim();
  const fullName = String(formData.get('full_name') || '').trim();
  const phone = String(formData.get('phone') || '').trim();
  const zaloPhone = String(formData.get('zalo_phone') || '').trim();
  const avatarUrl = String(formData.get('avatar_url') || '').trim();
  const licenseNumber = String(formData.get('license_number') || '').trim();
  const bio = String(formData.get('bio') || '').trim();
  const experienceYears = Number(formData.get('experience_years') || 0);
  const isVerified = formData.get('is_verified') === 'on';
  const isAdmin = formData.get('is_admin') === 'on';

  const coverageAreas = String(formData.get('coverage_areas') || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const specializations = String(formData.get('specializations') || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  if (!brokerId || !fullName || !phone) {
    throw new Error('Vui lòng nhập đầy đủ họ tên và số điện thoại.');
  }

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
      is_verified: isVerified,
      is_admin: isAdmin,
      updated_at: new Date().toISOString(),
    })
    .eq('id', brokerId);

  if (error) {
    throw new Error(`Cập nhật thông tin môi giới thất bại: ${error.message}`);
  }

  revalidatePath('/');
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/brokers');
  redirect('/dashboard/brokers?updated=1');
}

// 3. ADMIN DUYỆT / HỦY XÁC THỰC MÔI GIỚI (/dashboard/brokers)
export async function toggleBrokerVerification(brokerId: string, currentStatus: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Yêu cầu đăng nhập.');

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
