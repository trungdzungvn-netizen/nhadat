'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

// -------------------------------------------------------------
// HÀM GỬI THÔNG BÁO VỀ TELEGRAM BOT
// -------------------------------------------------------------
async function sendTelegramAlert(text: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.log('Chưa cấu hình TELEGRAM_BOT_TOKEN hoặc TELEGRAM_CHAT_ID trong .env');
    return;
  }

  try {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML',
      }),
    });
  } catch (err) {
    console.error('Lỗi gửi Telegram:', err);
  }
}

// -------------------------------------------------------------
// 1. ĐẶT LỊCH HẸN & BẮN TELEGRAM NGAY LẬP TỨC
// -------------------------------------------------------------
export async function bookAppointment(formData: FormData) {
  const trap = String(formData.get('b_trap') || '');
  if (trap.trim().length > 0) {
    throw new Error('Yêu cầu không hợp lệ.');
  }

  const supabase = await createClient();
  const propertyId = String(formData.get('property_id') || '');
  const brokerId = String(formData.get('broker_id') || '');
  const customerName = String(formData.get('customer_name') || '').trim();
  const customerPhone = String(formData.get('customer_phone') || '').trim();
  const appointmentDate = String(formData.get('appointment_date') || '');
  const timeSlot = String(formData.get('time_slot') || '');
  const note = String(formData.get('note') || '').trim();

  if (!customerName || customerName.length < 2 || !customerPhone || customerPhone.length < 9) {
    throw new Error('Vui lòng nhập họ tên và số điện thoại chính xác.');
  }

  // Lấy thông tin BĐS & Môi giới để tạo nội dung tin nhắn Telegram
  const { data: prop } = await supabase.from('properties').select('title, address').eq('id', propertyId).maybeSingle();
  const { data: broker } = await supabase.from('brokers').select('full_name, phone').eq('id', brokerId).maybeSingle();

  // 1. Lưu vào bảng appointments
  const { error: apptError } = await supabase.from('appointments').insert({
    property_id: propertyId,
    broker_id: brokerId,
    customer_name: customerName,
    customer_phone: customerPhone,
    appointment_date: appointmentDate,
    time_slot: timeSlot,
    note: note || null,
    status: 'pending',
  });

  if (apptError) {
    throw new Error(`Lỗi đặt lịch: ${apptError.message}`);
  }

  // 2. Ghi nhận lead
  await supabase.from('leads').insert({
    property_id: propertyId,
    broker_id: brokerId,
    customer_name: customerName,
    customer_phone: customerPhone,
    note: `Đặt lịch xem nhà ngày ${appointmentDate} lúc ${timeSlot}. ${note}`,
    stage: 'scheduled',
  });

  // 3. Gửi thông báo tức thì qua Telegram
  const teleMessage = `🚨 <b>CÓ LỊCH HẸN XEM NHÀ MỚI!</b>\n\n` +
    `👤 <b>Khách hàng:</b> ${customerName}\n` +
    `📞 <b>Điện thoại:</b> <code>${customerPhone}</code>\n` +
    `🗓 <b>Thời gian:</b> ${appointmentDate} (${timeSlot})\n` +
    `🏠 <b>Sản phẩm:</b> ${prop?.title || 'BĐS'}\n` +
    `📍 <b>Địa chỉ:</b> ${prop?.address || 'TP.HCM - Đồng Nai'}\n` +
    `👨‍💼 <b>Môi giới phụ trách:</b> ${broker?.full_name || 'Hệ thống'} (${broker?.phone || ''})\n` +
    `📝 <b>Ghi chú:</b> ${note || 'Không có'}`;

  await sendTelegramAlert(teleMessage);

  revalidatePath('/dashboard');
}

// -------------------------------------------------------------
// 2. MÔI GIỚI TỰ ĐĂNG BẤT ĐỘNG SẢN MỚI TỪ WORKSPACE
// -------------------------------------------------------------
export async function createProperty(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Lấy broker_id của user đang đăng nhập
  const { data: broker } = await supabase
    .from('brokers')
    .select('id, full_name, phone')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!broker) {
    throw new Error('Tài khoản chưa được liên kết hồ sơ môi giới.');
  }

  const title = String(formData.get('title') || '').trim();
  const propertyType = String(formData.get('property_type') || 'Căn hộ');
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
  const isExclusive = formData.get('is_exclusive') === 'on';

  if (!title || !address || !coverImage || price <= 0 || areaM2 <= 0) {
    throw new Error('Vui lòng điền đầy đủ tiêu đề, địa chỉ, ảnh đại diện, giá và diện tích.');
  }

  const { error } = await supabase.from('properties').insert({
    broker_id: broker.id,
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
    cover_image: coverImage,
    description,
    is_exclusive: isExclusive,
    is_featured: false,
    status: 'available',
  });

  if (error) {
    throw new Error(`Đăng tin thất bại: ${error.message}`);
  }

  // Gửi thông báo Telegram khi môi giới đăng tin mới
  const teleMsg = `🏡 <b>SẢN PHẨM MỚI ĐÃ ĐƯỢC TẠO!</b>\n\n` +
    `📌 <b>Tiêu đề:</b> ${title}\n` +
    `💰 <b>Giá:</b> ${priceDisplay} (${areaM2} m²)\n` +
    `📍 <b>Vị trí:</b> ${address}, ${district}, ${city}\n` +
    `👨‍💼 <b>Môi giới đăng:</b> ${broker.full_name} (${broker.phone})`;

  await sendTelegramAlert(teleMsg);

  revalidatePath('/');
  revalidatePath('/dashboard');
  redirect('/dashboard?created=1');
}
