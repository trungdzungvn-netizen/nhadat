-- NHÀ ĐẤT KẾT NỐI - SUPABASE DATABASE SCHEMA
-- Nền tảng môi giới bất động sản chuyên nghiệp TP.HCM - Đồng Nai

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. BẢNG HỒ SƠ MÔI GIỚI (Brokers Profile)
CREATE TABLE IF NOT EXISTS public.brokers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  zalo_phone TEXT,
  avatar_url TEXT,
  license_number TEXT,
  coverage_areas TEXT[] DEFAULT '{"Biên Hòa", "Thủ Đức", "TP.HCM"}'::text[],
  specializations TEXT[] DEFAULT '{"Căn hộ", "Nhà phố", "Đất nền"}'::text[],
  experience_years INT DEFAULT 3,
  is_verified BOOLEAN DEFAULT true,
  rating NUMERIC(2,1) DEFAULT 4.9,
  bio TEXT DEFAULT 'Chuyên viên tư vấn bất động sản khu vực TP.HCM - Đồng Nai. Hỗ trợ pháp lý, ngân hàng và thương lượng giá tốt.',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. BẢNG BẤT ĐỘNG SẢN / NGUỒN HÀNG (Listings)
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  broker_id UUID REFERENCES public.brokers(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  property_type TEXT NOT NULL, -- 'Căn hộ', 'Nhà phố', 'Biệt thự', 'Đất nền', 'Kho xưởng'
  city TEXT NOT NULL, -- 'TP.HCM', 'Đồng Nai'
  district TEXT NOT NULL, -- 'Biên Hòa', 'Thủ Đức', 'Quận 7', 'Long Thành', 'Nhơn Trạch'
  address TEXT NOT NULL,
  price NUMERIC NOT NULL, -- Đơn vị: tỷ VNĐ
  price_display TEXT NOT NULL, -- Ví dụ: '3.85 tỷ' hoặc '45 triệu/m²'
  area_m2 NUMERIC NOT NULL,
  bedrooms INT DEFAULT 2,
  bathrooms INT DEFAULT 2,
  legal_status TEXT DEFAULT 'Sổ hồng riêng',
  direction TEXT DEFAULT 'Đông Nam',
  description TEXT,
  cover_image TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  is_exclusive BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'available', -- 'available', 'reserved', 'sold'
  views_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. BẢNG KHÁCH HÀNG TIỀM NĂNG (Leads / Contacts)
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  broker_id UUID REFERENCES public.brokers(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  note TEXT,
  stage TEXT DEFAULT 'new', -- 'new', 'contacted', 'scheduled', 'negotiating', 'won', 'lost'
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. BẢNG LỊCH HẸN XEM NHÀ (Appointments)
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  broker_id UUID REFERENCES public.brokers(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  appointment_date DATE NOT NULL,
  time_slot TEXT NOT NULL, -- '08:30 - 10:00', '14:00 - 15:30', '16:00 - 17:30'
  note TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'completed', 'cancelled'
  created_at TIMESTAMPTZ DEFAULT now()
);

-- BẬT ROW LEVEL SECURITY (RLS)
ALTER TABLE public.brokers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- POLICIES CHO PHÉP XEM CÔNG KHAI
CREATE POLICY "Public read brokers" ON public.brokers FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read properties" ON public.properties FOR SELECT TO anon, authenticated USING (true);

-- POLICIES CHO PHÉP KHÁCH GỬI YÊU CẦU & ĐẶT LỊCH (ANTI-SPAM VALIDATION)
CREATE POLICY "Public insert leads" ON public.leads FOR INSERT TO anon, authenticated WITH CHECK (
  char_length(customer_name) >= 2 AND char_length(customer_phone) >= 9
);

CREATE POLICY "Public insert appointments" ON public.appointments FOR INSERT TO anon, authenticated WITH CHECK (
  char_length(customer_name) >= 2 AND char_length(customer_phone) >= 9
);

-- MÔI GIỚI XEM LEADS & LỊCH HẸN CỦA MÌNH
CREATE POLICY "Brokers manage own leads" ON public.leads FOR ALL TO authenticated USING (
  broker_id IN (SELECT id FROM public.brokers WHERE user_id = auth.uid())
);

CREATE POLICY "Brokers manage own appointments" ON public.appointments FOR ALL TO authenticated USING (
  broker_id IN (SELECT id FROM public.brokers WHERE user_id = auth.uid())
);

CREATE POLICY "Brokers manage own properties" ON public.properties FOR ALL TO authenticated USING (
  broker_id IN (SELECT id FROM public.brokers WHERE user_id = auth.uid())
);

-- SEED DỮ LIỆU MẪU MÔI GIỚI & BẤT ĐỘNG SẢN THỰC TẾ TP.HCM - ĐỒNG NAI
DO $$
DECLARE
  v_broker_id UUID;
BEGIN
  -- Tạo môi giới chuyên nghiệp mẫu
  INSERT INTO public.brokers (full_name, phone, zalo_phone, avatar_url, license_number, coverage_areas, specializations, experience_years, bio)
  VALUES (
    'Trần Hoàng Nam',
    '0908889999',
    '0908889999',
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
    'BDS-HCM-88291',
    ARRAY['Biên Hòa', 'Thủ Đức', 'Long Thành'],
    ARRAY['Căn hộ cao cấp', 'Nhà phố trung tâm', 'Đất dự án'],
    7,
    'Môi giới trưởng khu vực Đông Sài Gòn & Biên Hòa. Đồng hành tư vấn an cư và đầu tư sinh lời bền vững.'
  ) RETURNING id INTO v_broker_id;

  -- Thêm 6 bất động sản thực tế đẹp
  INSERT INTO public.properties (broker_id, title, property_type, city, district, address, price, price_display, area_m2, bedrooms, bathrooms, legal_status, cover_image, is_featured, is_exclusive, description)
  VALUES 
  (
    v_broker_id,
    'Biệt Thự Đơn Lập Aqua City - View Sông Đồng Nai Thoáng Đãng',
    'Biệt thự',
    'Đồng Nai',
    'Biên Hòa',
    'Đô thị Aqua City, Long Hưng, TP. Biên Hòa',
    14.5,
    '14.5 tỷ',
    240,
    4,
    4,
    'HĐMB - Đang chờ sổ',
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
    true,
    true,
    'Biệt thự phong cách Địa Trung Hải, hoàn thiện mặt ngoài, vị trí góc đối diện công viên ven sông.'
  ),
  (
    v_broker_id,
    'Căn Hộ 2PN Grand Marina Saigon - Bason Quận 1 Đẳng Cấp',
    'Căn hộ',
    'TP.HCM',
    'Quận 1',
    'Số 2 Tôn Đức Thắng, Phường Bến Nghé, Quận 1',
    21.0,
    '21 tỷ',
    88,
    2,
    2,
    'Sổ hồng sở hữu lâu dài',
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    true,
    false,
    'Căn hộ tiêu chuẩn Marriott Quốc tế, nội thất hàng hiệu nhập khẩu Ý, view trực diện sông Sài Gòn.'
  ),
  (
    v_broker_id,
    'Nhà Phố Thương Mại Shophouse Biên Hòa New City Mặt Tiền',
    'Nhà phố',
    'Đồng Nai',
    'Biên Hòa',
    'Khu đô thị Golf Long Thành, Phước Tân, Biên Hòa',
    5.8,
    '5.8 tỷ',
    120,
    3,
    3,
    'Sổ hồng riêng công chứng ngay',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    true,
    true,
    'Vị trí kinh doanh đắc địa, đường 24m thuận tiện mở văn phòng hoặc cho thuê dòng tiền ổn định.'
  ),
  (
    v_broker_id,
    'Căn Hộ Penthouse King Crown Infinity Thủ Đức',
    'Căn hộ',
    'TP.HCM',
    'Thủ Đức',
    '218 Võ Văn Ngân, Phường Bình Thọ, TP. Thủ Đức',
    12.2,
    '12.2 tỷ',
    165,
    3,
    3,
    'Sổ hồng lâu dài',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    false,
    false,
    'Căn góc tầng cao nhất, view panorama toàn thành phố Thủ Đức, bể bơi vô cực riêng.'
  ),
  (
    v_broker_id,
    'Đất Nền Sổ Đỏ Ven Sân Bay Quốc Tế Long Thành',
    'Đất nền',
    'Đồng Nai',
    'Long Thành',
    'Đường ĐT 769, Xã Bình Sơn, Long Thành',
    3.2,
    '3.2 tỷ',
    115,
    0,
    0,
    'Sổ đỏ thổ cư 100%',
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    false,
    true,
    'Hạ tầng đường nhựa 16m điện âm nước máy, cách cổng số 1 sân bay Long Thành chỉ 3.5km.'
  ),
  (
    v_broker_id,
    'Nhà Phố 1 Trệt 2 Lầu KDC Bửu Long Biên Hòa',
    'Nhà phố',
    'Đồng Nai',
    'Biên Hòa',
    'Phường Bửu Long, TP. Biên Hòa, Đồng Nai',
    4.6,
    '4.6 tỷ',
    95,
    3,
    3,
    'Sổ hoàn công đầy đủ',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    false,
    false,
    'Thiết kế tân cổ điển hiện đại, nội thất gỗ An Cường cao cấp, gần khu du lịch Bửu Long.'
  );
END $$;
