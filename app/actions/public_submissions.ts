'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

// Hàm gửi cảnh báo về Telegram Bot (nếu có cấu hình)
async function sendTelegramAlert(text: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId) return;

  try {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
      }),
    });
  } catch (err) {
    console.error('Lỗi gửi Telegram:', err);
  }
}

// -------------------------------------------------------------
// 1. ĐĂNG KÝ THÀNH VIÊN MÔI GIỚI (CHỜ ADMIN DUYỆT)
// -------------------------------------------------------------
export async function registerBroker(formData: FormData) {
  // Honeypot anti-spam
  const trap = String(formData.get('b_trap') || '');
  if (trap.trim().length > 0) throw new Error('Yêu cầu không hợp lệ.');

  const supabase = await createClient();

  const fullName = String(formData.get('full_name') || '').trim();
  const phone = String(formData.get('phone') || '').trim();
  const zaloPhone = String(formData.get('zalo_phone') || '').trim() || phone;
  const avatarUrl = String(formData.get('avatar_url') || '').trim();
  const licenseNumber = String(formData.get('license_number') || '').trim();
  const experienceYears = Number(formData.get('experience_years') || 1);
  const bio = String(formData.get('bio') || '').trim();

  const coverageAreas = String(formData.get('coverage_areas') || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const specializations = String(formData.get('specializations') || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  if (!fullName || fullName.length < 2 || !phone || phone.length < 9) {
    throw new Error('Vui lòng điền đầy đủ họ tên và số điện thoại hợp lệ.');
  }

  const { error } = await supabase.from('brokers').insert({
    full_name: fullName,
    phone,
    zalo_phone: zaloPhone,
    avatar_url: avatarUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    license_number: licenseNumber || null,
    experience_years: experienceYears,
    coverage_areas: coverageAreas.length > 0 ? coverageAreas : ['Biên Hòa', 'Đồng Nai'],
    specializations: specializations.length > 0 ? specializations : ['Nhà phố', 'Căn hộ'],
    bio: bio || 'Chuyên viên tư vấn bất động sản khu vực TP.HCM - Đồng Nai.',
    status: 'pending', // Chờ admin duyệt
    is_verified: false,
    rating: 5.0,
  });

  if (error) {
    throw new Error(`Đăng ký thất bại: ${error.message}`);
  }

  // Bắn thông báo Telegram
  const msg = `📋 <b>ĐĂNG KÝ MÔI GIỚI MỚI (CHỜ DUYỆT)!</b>\n\n` +
    `👤 <b>Họ tên:</b> ${fullName}\n` +
    `📞 <b>Điện thoại:</b> <code>${phone}</code>\n` +
    `📍 <b>Địa bàn:</b> ${coverageAreas.join(', ') || 'Chưa cập nhật'}\n` +
    `📜 <b>CCHN:</b> ${licenseNumber || 'Chưa cung cấp'}\n` +
    `⏳ <i>Vui lòng vào Dashboard để duyệt môi giới.</i>`;

  await sendTelegramAlert(msg);
  revalidatePath('/dashboard/brokers');
}

// -------------------------------------------------------------
// 2. KHÁCH / MÔI GIỚI GỬI BẤT ĐỘNG SẢN CẦN GIAO DỊCH (CHỜ ADMIN DUYỆT)
// -------------------------------------------------------------
export async function submitPropertyForReview(formData: FormData) {
  // Honeypot anti-spam
  const trap = String(formData.get('b_trap') || '');
  if (trap.trim().length > 0) throw new Error('Yêu cầu không hợp lệ.');

  const supabase = await createClient();

  const title = String(formData.get('title') || '').trim();
  const propertyType = String(formData.get('property_type') || 'Nhà phố');
  const city = String(formData.get('city') || 'Đồng Nai');
  const district = String(formData.get('district') || '').trim();
  const address = String(formData.get('address') || '').trim();
  const price = Number(formData.get('price') || 0);
  const priceDisplay = String(formData.get('price_display') || `${price} tỷ`).trim();
  const areaM2 = Number(formData.get('area_m2') || 0);
  const bedrooms = Number(formData.get('bedrooms') || 0);
  const bathrooms = Number(formData.get('bathrooms') || 0);
  const legalStatus = String(formData.get('legal_status') || 'Sổ hồng riêng').trim();
  const direction = String(formData.get('direction') || 'Đông Nam').trim();
  const coverImage = String(formData.get('cover_image') || '').trim();
  const description = String(formData.get('description') || '').trim();
  const contactName = String(formData.get('contact_name') || '').trim();
  const contactPhone = String(formData.get('contact_phone') || '').trim();

  if (!title || !address || !contactName || !contactPhone || price <= 0 || areaM2 <= 0) {
    throw new Error('Vui lòng điền đầy đủ tiêu đề, địa chỉ, người liên hệ, giá và diện tích.');
  }

  const { error } = await supabase.from('properties').insert({
    title,
    property_type: propertyType,
    city,
    district,
    address,
    price,
    price_display: priceDisplay,
    area_m2: areaM2,
    bedrooms,
    bathrooms,
    legal_status: legalStatus,
    direction,
    cover_image: coverImage || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80',
    description: `${description}\n\n[Thông tin người gửi ký gửi/giao dịch: ${contactName} - SĐT: ${contactPhone}]`,
    status: 'pending', // Chờ duyệt
    is_featured: false,
    is_exclusive: false,
  });

  if (error) {
    throw new Error(`Gửi tin thất bại: ${error.message}`);
  }

  // Bắn thông báo Telegram
  const msg = `🏠 <b>BẤT ĐỘNG SẢN MỚI CẦN DUYỆT!</b>\n\n` +
    `📌 <b>Tiêu đề:</b> ${title}\n` +
    `💰 <b>Giá:</b> ${priceDisplay} (${areaM2} m²)\n` +
    `📍 <b>Địa chỉ:</b> ${address}, ${district}, ${city}\n` +
    `👤 <b>Người ký gửi:</b> ${contactName} (<code>${contactPhone}</code>)\n` +
    `⏳ <i>Vui lòng vào Dashboard kiểm tra pháp lý và duyệt đăng sàn.</i>`;

  await sendTelegramAlert(msg);
  revalidatePath('/dashboard');
}

// -------------------------------------------------------------
// 3. ADMIN PHÊ DUYỆT / TỪ CHỐI MÔI GIỚI HOẶC BĐS
// -------------------------------------------------------------
export async function adminApproveBroker(brokerId: string, newStatus: 'approved' | 'rejected') {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Yêu cầu đăng nhập.');

  const { error } = await supabase
    .from('brokers')
    .update({ status: newStatus, is_verified: newStatus === 'approved' })
    .eq('id', brokerId);

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/brokers');
  revalidatePath('/');
}

export async function adminApproveProperty(propertyId: string, newStatus: 'available' | 'rejected') {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Yêu cầu đăng nhập.');

  const { error } = await supabase
    .from('properties')
    .update({ status: newStatus })
    .eq('id', propertyId);

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard');
  revalidatePath('/');
}
