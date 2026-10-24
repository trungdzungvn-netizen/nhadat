import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, Bed, Bath, Maximize2, Compass, ShieldCheck, CheckCircle2, Phone, Calendar } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import BrokerProfileCard from '@/components/BrokerProfileCard';
import AppointmentModal from '@/components/AppointmentModal';
import type { Property, Broker } from '@/types';

export const revalidate = 0;

export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  const { data } = await supabase
    .from('properties')
    .select('*, brokers(*)')
    .eq('id', params.id)
    .maybeSingle();

  if (!data) notFound();
  const property = data as Property;
  const broker = property.brokers as Broker;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-4">
        <Link href="/" className="text-xs font-bold text-champagne-600 hover:underline">
          ← Quay lại danh sách sản phẩm
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.35fr_0.65fr]">
        {/* CỘT TRÁI: ẢNH & THÔNG TIN BẤT ĐỘNG SẢN */}
        <div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-navy-950 shadow-xl">
            <Image
              src={property.cover_image}
              alt={property.title}
              fill
              priority
              className="object-cover"
            />
            <span className="absolute left-5 top-5 rounded-full bg-navy-950/85 px-4 py-1.5 text-xs font-bold text-champagne-300 backdrop-blur-md">
              {property.property_type}
            </span>
          </div>

          <div className="mt-8 rounded-3xl border border-stone-200 bg-white p-6 sm:p-8">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h1 className="text-2xl font-black text-navy-950 sm:text-3xl">{property.title}</h1>
              <p className="text-3xl font-black text-champagne-600">{property.price_display}</p>
            </div>

            <p className="mt-3 flex items-center gap-2 text-xs text-stone-500 sm:text-sm">
              <MapPin size={16} className="text-champagne-500 shrink-0" />
              {property.address}, {property.district}, {property.city}
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4 rounded-2xl bg-sand-100 p-4 sm:grid-cols-4">
              <div>
                <p className="text-[11px] text-stone-500">Diện tích</p>
                <p className="mt-0.5 font-black text-navy-950">{property.area_m2} m²</p>
              </div>
              <div>
                <p className="text-[11px] text-stone-500">Phòng ngủ</p>
                <p className="mt-0.5 font-black text-navy-950">{property.bedrooms} phòng</p>
              </div>
              <div>
                <p className="text-[11px] text-stone-500">Phòng tắm</p>
                <p className="mt-0.5 font-black text-navy-950">{property.bathrooms} WC</p>
              </div>
              <div>
                <p className="text-[11px] text-stone-500">Pháp lý</p>
                <p className="mt-0.5 font-black text-navy-950">{property.legal_status}</p>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-base font-bold text-navy-950">Mô tả chi tiết</h2>
              <p className="mt-3 whitespace-pre-line text-xs leading-relaxed text-stone-700 sm:text-sm">
                {property.description}
              </p>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: PROFILE MÔI GIỚI PHỤ TRÁCH & ĐẶT LỊCH */}
        <div className="space-y-6">
          <AppointmentModal
            propertyId={property.id}
            brokerId={property.broker_id}
            propertyTitle={property.title}
          />

          {broker && <BrokerProfileCard broker={broker} />}

          <div className="rounded-3xl border border-stone-200 bg-white p-6 text-xs text-stone-600 space-y-3">
            <h3 className="font-bold text-navy-950 text-sm">Cam kết từ Nhà Đất Kết Nối</h3>
            <p className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> Môi giới được kiểm duyệt giấy tờ hành nghề.</p>
            <p className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> Nguồn hàng đã xác thực sổ sách pháp lý.</p>
            <p className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> Không phát sinh chi phí trung gian không rõ ràng.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
