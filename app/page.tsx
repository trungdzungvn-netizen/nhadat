import Link from 'next/link';
import Image from 'next/image';
import { Search, MapPin, ShieldCheck, Bed, Bath, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import type { Property, Broker } from '@/types';

export const revalidate = 0;

export default async function HomePage({
  searchParams,
}: {
  searchParams: { city?: string; property_type?: string; q?: string };
}) {
  const supabase = await createClient();

  // Truy vấn danh sách BĐS công khai
  let query = supabase
    .from('properties')
    .select('*, brokers(*)')
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false });

  if (searchParams.city) {
    query = query.eq('city', searchParams.city);
  }
  if (searchParams.property_type) {
    query = query.eq('property_type', searchParams.property_type);
  }
  if (searchParams.q) {
    query = query.ilike('title', `%${searchParams.q}%`);
  }

  const { data: propertiesData } = await query;
  const properties = (propertiesData || []) as Property[];

  // Danh sách môi giới tiêu biểu
  const { data: brokersData } = await supabase.from('brokers').select('*').limit(3);
  const brokers = (brokersData || []) as Broker[];

  return (
    <>
      {/* 1. HERO BANNER */}
      <section className="relative overflow-hidden bg-navy-950 py-20 text-white lg:py-28">
        <div
          className="absolute inset-0 z-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(#C5A059 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-champagne-400/40 bg-navy-900/80 px-4 py-1.5 text-xs font-bold text-champagne-300 backdrop-blur-md">
              <ShieldCheck size={16} className="text-champagne-400" /> NỀN TẢNG MÔI GIỚI BẤT ĐỘNG SẢN CHUYÊN NGHIỆP
            </div>
            <h1 className="mt-6 text-3xl font-black leading-tight sm:text-5xl lg:text-6xl">
              Nguồn Hàng Xác Thực.<br />
              <span className="bg-gradient-to-r from-champagne-300 via-champagne-400 to-champagne-600 bg-clip-text text-transparent">
                Môi Giới Tận Tâm.
              </span>
            </h1>
            <p className="mt-5 text-sm leading-relaxed text-stone-300 sm:text-base">
              Hệ thống sàn giao dịch chọn lọc tại khu vực kinh tế trọng điểm <strong>TP.HCM – Đồng Nai</strong>. Bảo đảm pháp lý minh bạch, định giá chính xác và hỗ trợ xem nhà thực tế 24/7.
            </p>
          </div>

          {/* THANH TÌM KIẾM */}
          <div className="mx-auto mt-10 max-w-4xl rounded-3xl border border-champagne-400/30 bg-navy-900/90 p-4 shadow-2xl backdrop-blur-xl">
            <form action="/" method="GET" className="grid gap-3 sm:grid-cols-4">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-champagne-400">Từ khóa tìm kiếm</label>
                <div className="mt-1 flex items-center gap-2 rounded-xl border border-navy-700 bg-navy-950 px-3 py-2.5">
                  <Search size={16} className="text-stone-400" />
                  <input
                    type="text"
                    name="q"
                    defaultValue={searchParams.q || ''}
                    placeholder="Dự án, đường, khu vực..."
                    className="w-full bg-transparent text-xs text-white placeholder-stone-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-champagne-400">Thị trường</label>
                <select
                  name="city"
                  defaultValue={searchParams.city || ''}
                  className="mt-1 w-full rounded-xl border border-navy-700 bg-navy-950 px-3 py-2.5 text-xs text-white focus:outline-none"
                >
                  <option value="">Toàn bộ khu vực</option>
                  <option value="Đồng Nai">Đồng Nai (Biên Hòa, Long Thành)</option>
                  <option value="TP.HCM">TP.HCM (Thủ Đức, Q1, Q7)</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-champagne-400 to-champagne-600 py-3 text-xs font-black text-navy-950 shadow-md transition hover:brightness-110"
                >
                  <Search size={14} /> TÌM SẢN PHẨM
                </button>
              </div>
            </form>
          </div>

          {/* CHỈ SỐ UY TÍN */}
          <div className="mt-10 grid grid-cols-2 gap-4 border-t border-navy-900 pt-8 text-center sm:grid-cols-4">
            <div>
              <p className="text-2xl font-black text-champagne-400">100%</p>
              <p className="mt-1 text-xs text-stone-400">Pháp lý kiểm tra trước</p>
            </div>
            <div>
              <p className="text-2xl font-black text-champagne-400">500+</p>
              <p className="mt-1 text-xs text-stone-400">Nguồn hàng độc quyền</p>
            </div>
            <div>
              <p className="text-2xl font-black text-champagne-400">24/7</p>
              <p className="mt-1 text-xs text-stone-400">Đặt lịch xem nhà thực tế</p>
            </div>
            <div>
              <p className="text-2xl font-black text-champagne-400">TP.HCM - ĐN</p>
              <p className="mt-1 text-xs text-stone-400">Chuyên sâu khu vực</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DANH SÁCH BẤT ĐỘNG SẢN */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-champagne-600">Nguồn Hàng Chọn Lọc</span>
            <h2 className="mt-1 text-2xl font-black text-navy-950 sm:text-3xl">Bất Động Sản Nổi Bật</h2>
            <p className="mt-1 text-xs text-stone-500">Giỏ hàng đã xác thực sổ hồng, giá chuẩn làm việc trực tiếp môi giới phụ trách.</p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            <Link href="/" className="rounded-full bg-navy-900 px-4 py-2 text-white">Tất cả</Link>
            <Link href="/?city=Đồng Nai" className="rounded-full border border-stone-200 bg-white px-4 py-2 text-navy-900 hover:bg-sand-100">Đồng Nai</Link>
            <Link href="/?city=TP.HCM" className="rounded-full border border-stone-200 bg-white px-4 py-2 text-navy-900 hover:bg-sand-100">TP.HCM</Link>
          </div>
        </div>

        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <article
              key={property.id}
              className="group overflow-hidden rounded-3xl border border-champagne-200/70 bg-white shadow-md transition hover:-translate-y-1.5 hover:shadow-2xl"
            >
              <Link href={`/properties/${property.id}`}>
                <div className="relative aspect-[16/10] overflow-hidden bg-navy-900">
                  <Image
                    src={property.cover_image}
                    alt={property.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-transparent" />
                  
                  <span className="absolute left-4 top-4 rounded-full bg-navy-950/85 px-3 py-1 text-[11px] font-bold text-champagne-300 backdrop-blur-md">
                    {property.property_type}
                  </span>

                  {property.is_exclusive && (
                    <span className="absolute right-4 top-4 rounded-full bg-champagne-500 px-3 py-1 text-[11px] font-black text-navy-950 shadow-md">
                      ĐỘC QUYỀN
                    </span>
                  )}

                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
                    <p className="text-xl font-black text-champagne-300">{property.price_display}</p>
                    <p className="text-xs text-stone-200">{property.area_m2} m²</p>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="line-clamp-2 text-base font-bold text-navy-950 group-hover:text-champagne-600">
                    {property.title}
                  </h3>

                  <p className="mt-2 flex items-center gap-1.5 text-xs text-stone-500 line-clamp-1">
                    <MapPin size={14} className="shrink-0 text-champagne-500" />
                    {property.address}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-3 text-xs text-stone-600">
                    <span className="flex items-center gap-1"><Bed size={15} /> {property.bedrooms} PN</span>
                    <span className="flex items-center gap-1"><Bath size={15} /> {property.bathrooms} WC</span>
                    <span className="flex items-center gap-1 font-semibold text-navy-900">
                      <CheckCircle size={14} className="text-emerald-500" /> {property.legal_status}
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* 3. ĐỘI NGŨ MÔI GIỚI */}
      <section id="brokers" className="border-t border-champagne-200/60 bg-sand-100/60 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-champagne-600">Đội Ngũ Chuyên Gia</span>
            <h2 className="mt-1 text-2xl font-black text-navy-950 sm:text-3xl">Môi Giới Phụ Trách Khu Vực</h2>
            <p className="mt-1 text-xs text-stone-500">Mỗi sản phẩm đều có chuyên viên tư vấn am hiểu thị trường, hỗ trợ đàm phán và thủ tục pháp lý.</p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {brokers.map((broker) => (
              <div key={broker.id} className="rounded-3xl border border-champagne-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="relative h-14 w-14 overflow-hidden rounded-2xl border-2 border-champagne-400">
                    <Image src={broker.avatar_url} alt={broker.full_name} fill className="object-cover" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-navy-950">{broker.full_name}</h3>
                    <p className="text-xs font-semibold text-champagne-600">{broker.experience_years} năm kinh nghiệm</p>
                    <p className="text-[11px] text-stone-500">CCHN: {broker.license_number || 'Đã xác minh'}</p>
                  </div>
                </div>
                <p className="mt-4 line-clamp-3 text-xs leading-relaxed text-stone-600">{broker.bio}</p>
                <div className="mt-4 flex gap-2">
                  <a
                    href={`tel:${broker.phone}`}
                    className="flex-1 rounded-xl bg-navy-900 py-2.5 text-center text-xs font-bold text-champagne-300 hover:bg-navy-800"
                  >
                    Gọi: {broker.phone}
                  </a>
                  <a
                    href={`https://zalo.me/${broker.zalo_phone || broker.phone}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl border border-stone-200 px-3 py-2.5 text-center text-xs font-bold text-navy-950 hover:bg-sand-50"
                  >
                    Zalo
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
