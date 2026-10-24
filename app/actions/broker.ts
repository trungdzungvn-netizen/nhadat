'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

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

  // Tách mảng khu vực & chuyên môn
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

  // Cập nhật thông tin vào bảng brokers
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
