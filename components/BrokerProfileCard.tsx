import Image from 'next/image';
import { ShieldCheck, Phone, MessageSquare, Calendar, Award } from 'lucide-react';
import type { Broker } from '@/types';

export default function BrokerProfileCard({ broker }: { broker: Broker }) {
  return (
    <div className="rounded-3xl border border-champagne-200/80 bg-white p-6 shadow-xl shadow-navy-950/5">
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 overflow-hidden rounded-2xl border-2 border-champagne-400 shadow-md">
          <Image
            src={broker.avatar_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80'}
            alt={broker.full_name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="text-base font-black text-navy-950">{broker.full_name}</h3>
            {broker.is_verified && (
              <span title="Môi giới đã xác minh chứng chỉ & CCCD">
                <ShieldCheck size={18} className="text-champagne-500" />
              </span>
            )}
          </div>
          <p className="text-xs font-semibold text-champagne-600">
            {broker.experience_years} năm kinh nghiệm · Đánh giá {broker.rating}★
          </p>
          {broker.license_number && (
            <p className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
              <Award size={12} className="text-champagne-500" /> CCHN: {broker.license_number}
            </p>
          )}
        </div>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-stone-600 border-t border-stone-100 pt-3">
        {broker.bio}
      </p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {broker.coverage_areas.map((area) => (
          <span key={area} className="rounded-full bg-sand-100 px-2.5 py-1 text-[11px] font-semibold text-navy-800">
            {area}
          </span>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2.5">
        <a
          href={`tel:${broker.phone}`}
          className="flex items-center justify-center gap-1.5 rounded-xl bg-navy-900 py-3 text-xs font-bold text-white shadow-md transition hover:bg-navy-800"
        >
          <Phone size={14} className="text-champagne-400" /> Gọi trực tiếp
        </a>
        <a
          href={`https://zalo.me/${broker.zalo_phone || broker.phone}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 rounded-xl border border-navy-200 bg-white py-3 text-xs font-bold text-navy-900 shadow-sm transition hover:bg-sand-50"
        >
          <MessageSquare size={14} className="text-blue-600" /> Chat Zalo
        </a>
      </div>
    </div>
  );
}
