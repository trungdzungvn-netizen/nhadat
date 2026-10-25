'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Star, ThumbsUp, CheckCircle2, ShieldCheck } from 'lucide-react';
import { addBrokerReview } from '@/app/actions/kpi_review';

export default function PublicBrokerReviewPage({ params }: { params: { id: string } }) {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [rating, setRating] = useState(5);
  const [attitude, setAttitude] = useState(5);
  const [expertise, setExpertise] = useState(5);
  const [negotiation, setNegotiation] = useState(5);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const formData = new FormData(e.currentTarget);
    formData.append('broker_id', params.id);
    formData.append('rating', String(rating));
    formData.append('criteria_attitude', String(attitude));
    formData.append('criteria_expertise', String(expertise));
    formData.append('criteria_negotiation', String(negotiation));

    try {
      await addBrokerReview(formData);
      setSuccess(true);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Có lỗi xảy ra.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-navy-800 hover:text-champagne-600">
          <ArrowLeft size={16} /> Quay lại trang chủ
        </Link>
      </div>

      <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-xl sm:p-10">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-champagne-400 to-champagne-600 text-navy-950 shadow-md">
            <Star size={28} className="fill-navy-950 stroke-[1.5]" />
          </div>
          <h1 className="mt-4 text-2xl font-black text-navy-950 sm:text-3xl">Đánh Giá Dịch Vụ Môi Giới</h1>
          <p className="mt-2 text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
            Ý kiến đóng góp chân thực của bạn giúp nâng cao chuẩn mực dịch vụ tư vấn bất động sản chuyên nghiệp tại Nhà Đất Kết Nối.
          </p>
        </div>

        {success ? (
          <div className="my-10 rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
            <CheckCircle2 size={56} className="mx-auto text-emerald-600 animate-bounce" />
            <h3 className="mt-4 text-lg font-black text-navy-950">Cảm ơn bạn đã gửi đánh giá!</h3>
            <p className="mt-2 text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
              Nhận xét của bạn đã được ghi nhận và đóng góp trực tiếp vào chỉ số uy tín (KPI) của chuyên viên tư vấn.
            </p>
            <div className="mt-6">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-xl bg-navy-900 px-6 py-3 text-xs font-black text-champagne-300 shadow-md hover:bg-navy-800"
              >
                Về trang chủ
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <input type="text" name="b_trap" className="hidden" tabIndex={-1} autoComplete="off" />

            {/* ĐIỂM TỔNG THỂ */}
            <div className="rounded-2xl bg-sand-50 p-5 text-center border border-champagne-200">
              <label className="block text-xs font-bold uppercase tracking-wider text-navy-900">
                Mức độ hài lòng tổng thể *
              </label>
              <div className="mt-3 flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 transition hover:scale-125"
                  >
                    <Star
                      size={28}
                      className={star <= rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}
                    />
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs font-black text-champagne-700">{rating} sao / 5 sao</p>
            </div>

            {/* 3 TIÊU CHÍ */}
            <div className="space-y-4 rounded-2xl border border-stone-200 p-5">
              <p className="text-xs font-bold text-navy-950 uppercase tracking-wider mb-2">
                Đánh giá theo từng tiêu chí dịch vụ:
              </p>

              <div className="flex items-center justify-between">
                <span className="text-xs text-stone-700 font-medium">1. Thái độ & tác phong đúng giờ:</span>
                <select
                  value={attitude}
                  onChange={(e) => setAttitude(Number(e.target.value))}
                  className="rounded-xl border border-stone-200 p-1.5 text-xs font-bold text-navy-950 focus:outline-none"
                >
                  <option value={5}>5 sao (Rất tốt)</option>
                  <option value={4}>4 sao (Tốt)</option>
                  <option value={3}>3 sao (Bình thường)</option>
                  <option value={2}>2 sao (Cần cải thiện)</option>
                  <option value={1}>1 sao (Kém)</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-stone-700 font-medium">2. Am hiểu quy hoạch & pháp lý:</span>
                <select
                  value={expertise}
                  onChange={(e) => setExpertise(Number(e.target.value))}
                  className="rounded-xl border border-stone-200 p-1.5 text-xs font-bold text-navy-950 focus:outline-none"
                >
                  <option value={5}>5 sao (Rất vững)</option>
                  <option value={4}>4 sao (Khá vững)</option>
                  <option value={3}>3 sao (Bình thường)</option>
                  <option value={2}>2 sao (Còn lúng túng)</option>
                  <option value={1}>1 sao (Không nắm rõ)</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-stone-700 font-medium">3. Hỗ trợ thương lượng giá tốt:</span>
                <select
                  value={negotiation}
                  onChange={(e) => setNegotiation(Number(e.target.value))}
                  className="rounded-xl border border-stone-200 p-1.5 text-xs font-bold text-navy-950 focus:outline-none"
                >
                  <option value={5}>5 sao (Xuất sắc)</option>
                  <option value={4}>4 sao (Tốt)</option>
                  <option value={3}>3 sao (Bình thường)</option>
                  <option value={2}>2 sao (Chưa tối ưu)</option>
                  <option value={1}>1 sao (Không hỗ trợ)</option>
                </select>
              </div>
            </div>

            {/* THÔNG TIN KHÁCH */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy-900">
                  Tên của bạn *
                </label>
                <input
                  type="text"
                  name="customer_name"
                  required
                  placeholder="Ví dụ: Anh Dũng (Biên Hòa)"
                  className="mt-1.5 w-full rounded-xl border border-stone-200 p-3 text-xs focus:border-champagne-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy-900">
                  Số điện thoại (để xác thực review)
                </label>
                <input
                  type="tel"
                  name="customer_phone"
                  placeholder="0912 345 678"
                  className="mt-1.5 w-full rounded-xl border border-stone-200 p-3 text-xs focus:border-champagne-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy-900">
                Nhận xét chi tiết của bạn *
              </label>
              <textarea
                name="comment"
                required
                rows={4}
                placeholder="Chia sẻ trải nghiệm thực tế khi bạn làm việc với chuyên viên môi giới này..."
                className="mt-1.5 w-full rounded-xl border border-stone-200 p-3 text-xs focus:border-champagne-500 focus:outline-none leading-relaxed"
              ></textarea>
            </div>

            {errorMsg && (
              <p className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-bold text-rose-700">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-champagne-400 to-champagne-600 py-3.5 text-xs font-black text-navy-950 shadow-md transition hover:brightness-105 disabled:opacity-50"
            >
              {loading ? 'Đang gửi...' : 'GỬI ĐÁNH GIÁ MÔI GIỚI'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
