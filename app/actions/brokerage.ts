'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function bookAppointment(formData: FormData) {
  // Anti-spam honeypot
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

  // 1. Tạo lịch hẹn vào bảng appointments
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

  // 2. Tự động ghi nhận vào bảng Leads để quản lý khách hàng
  await supabase.from('leads').insert({
    property_id: propertyId,
    broker_id: brokerId,
    customer_name: customerName,
    customer_phone: customerPhone,
    note: `Đặt lịch xem nhà ngày ${appointmentDate} lúc ${timeSlot}. ${note}`,
    stage: 'scheduled',
  });

  revalidatePath('/dashboard');
}
