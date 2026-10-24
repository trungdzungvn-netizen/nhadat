'use client';

import { useState } from 'react';
import { Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { bookAppointment } from '@/app/actions/brokerage';

export default function AppointmentModal({
  propertyId,
  brokerId,
  propertyTitle,
}: {
  propertyId: string;
  brokerId: string;
  propertyTitle: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const formData = new FormData(e.currentTarget);
    try {
      await bookAppointment(formData);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setIsOpen(false);
      }, 2500);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Có lỗi xảy ra.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-champagne-400 via-champagne-500 to-champagne-600 px-6 py-4 text-sm font-black text-navy-950 shadow-lg shadow-champagne-500/20 transition hover:brightness-105"
      >
        <Calendar size={18} /> ĐẶT LỊCH XEM NHÀ THỰC TẾ
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/70 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-3xl border border-champagne-200 bg-white p-6 shadow-2xl sm:p-8">
            <h3 className="text-xl font-black text-navy-950">Đặt lịch hẹn tham quan</h3>
            <p className="mt-1 text-xs text-stone-500 line-clamp-1">{propertyTitle}</p>

            {success ? (
              <div className="my-8 flex flex-col items-center justify-center py-6 text-center">
                <CheckCircle2 size={56} className="text-emerald-500 animate-bounce" />
                <h4 className="mt-3 text-lg font-bold text-navy-950">Đã gửi yêu cầu thành công!</h4>
                <p className="mt-1 text-xs text-stone-500">Môi giới phụ trách sẽ gọi điện xác nhận trong 15 phút.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <input type="hidden" name="property_id" value={propertyId} />
                <input type="hidden" name="broker_id" value={brokerId} />

                {/* Honeypot field for anti-spam */}
                <input type="text" name="b_trap" className="hidden" tabIndex={-1} autoComplete="off" />

                <div>
                  <label className="block text-xs font-bold text-navy-900">Họ và tên của bạn *</label>
                  <input
                    type="text"
                    name="customer_name"
                    required
                    placeholder="Ví dụ: Nguyễn Văn An"
                    className="mt-1 w-full rounded-xl border border-stone-200 p-3 text-xs focus:border-champagne-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-900">Số điện thoại liên hệ *</label>
                  <input
                    type="tel"
                    name="customer_phone"
                    required
                    placeholder="Ví dụ: 0912 345 678"
                    className="mt-1 w-full rounded-xl border border-stone-200 p-3 text-xs focus:border-champagne-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-navy-900">Ngày mong muốn *</label>
                    <input
                      type="date"
                      name="appointment_date"
                      required
                      defaultValue={new Date().toISOString().split('T')[0]}
                      className="mt-1 w-full rounded-xl border border-stone-200 p-3 text-xs focus:border-champagne-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-navy-900">Khung giờ *</label>
                    <select
                      name="time_slot"
                      required
                      className="mt-1 w-full rounded-xl border border-stone-200 p-3 text-xs focus:border-champagne-500 focus:outline-none"
                    >
                      <option value="08:30 - 10:00">08:30 - 10:00 (Sáng)</option>
                      <option value="10:00 - 11:30">10:00 - 11:30 (Trưa)</option>
                      <option value="14:00 - 15:30">14:00 - 15:30 (Chiều)</option>
                      <option value="16:00 - 17:30">16:00 - 17:30 (Xế chiều)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-900">Ghi chú thêm</label>
                  <textarea
                    name="note"
                    rows={2}
                    placeholder="Ví dụ: Tôi muốn kiểm tra sổ hồng và thương lượng trực tiếp"
                    className="mt-1 w-full rounded-xl border border-stone-200 p-3 text-xs focus:border-champagne-500 focus:outline-none"
                  ></textarea>
                </div>

                {errorMsg && <p className="text-xs text-rose-600 font-semibold">{errorMsg}</p>}

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 rounded-xl border border-stone-200 py-3 text-xs font-bold text-stone-600 hover:bg-stone-50"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 rounded-xl bg-navy-900 py-3 text-xs font-bold text-champagne-300 hover:bg-navy-800 disabled:opacity-50"
                  >
                    {loading ? 'Đang gửi...' : 'Xác nhận đặt lịch'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
