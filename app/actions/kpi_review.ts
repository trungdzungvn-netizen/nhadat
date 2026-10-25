'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

// -------------------------------------------------------------
// 1. KHÁCH HÀNG GỬI ĐÁNH GIÁ (REVIEW) MÔI GIỚI
// -------------------------------------------------------------
export async function addBrokerReview(formData: FormData) {
  const trap = String(formData.get('b_trap') || '');
  if (trap.trim().length > 0) throw new Error('Thao tác không hợp lệ.');

  const supabase = await createClient();

  const brokerId = String(formData.get('broker_id') || '').trim();
  const customerName = String(formData.get('customer_name') || '').trim();
  const customerPhone = String(formData.get('customer_phone') || '').trim();
  const rating = Number(formData.get('rating') || 5);
  const criteriaAttitude = Number(formData.get('criteria_attitude') || 5);
  const criteriaExpertise = Number(formData.get('criteria_expertise') || 5);
  const criteriaNegotiation = Number(formData.get('criteria_negotiation') || 5);
  const comment = String(formData.get('comment') || '').trim();

  if (!brokerId || !customerName || customerName.length < 2 || !comment || comment.length < 5) {
    throw new Error('Vui lòng nhập tên của bạn và nội dung nhận xét từ 5 ký tự trở lên.');
  }

  const { error } = await supabase.from('broker_reviews').insert({
    broker_id: brokerId,
    customer_name: customerName,
    customer_phone: customerPhone || null,
    rating,
    criteria_attitude: criteriaAttitude,
    criteria_expertise: criteriaExpertise,
    criteria_negotiation: criteriaNegotiation,
    comment,
    is_approved: true, // Mặc định hiển thị, admin có quyền ẩn
  });

  if (error) {
    throw new Error(`Gửi đánh giá thất bại: ${error.message}`);
  }

  revalidatePath('/dashboard/kpi');
  revalidatePath('/#brokers');
}

// -------------------------------------------------------------
// 2. ADMIN THIẾT LẬP MỤC TIÊU KPI CHO MÔI GIỚI
// -------------------------------------------------------------
export async function updateBrokerKPI(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const brokerId = String(formData.get('broker_id') || '').trim();
  const targetDeals = Number(formData.get('kpi_target_deals') || 3);
  const targetLeads = Number(formData.get('kpi_target_leads') || 15);
  const targetAppts = Number(formData.get('kpi_target_appts') || 10);

  if (!brokerId) throw new Error('Thiếu ID môi giới.');

  const { error } = await supabase
    .from('brokers')
    .update({
      kpi_target_deals: targetDeals,
      kpi_target_leads: targetLeads,
      kpi_target_appts: targetAppts,
      updated_at: new Date().toISOString(),
    })
    .eq('id', brokerId);

  if (error) {
    throw new Error(`Cập nhật KPI thất bại: ${error.message}`);
  }

  revalidatePath('/dashboard/kpi');
}

// -------------------------------------------------------------
// 3. ADMIN DUYỆT / ẨN ĐÁNH GIÁ CỦA KHÁCH HÀNG
// -------------------------------------------------------------
export async function toggleReviewApproval(reviewId: string, currentStatus: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { error } = await supabase
    .from('broker_reviews')
    .update({ is_approved: !currentStatus })
    .eq('id', reviewId);

  if (error) throw new Error(error.message);

  revalidatePath('/dashboard/kpi');
}
