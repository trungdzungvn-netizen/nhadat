-- ==============================================================================
-- MIGRATION: BỔ SUNG KPI VÀ HỆ THỐNG ĐÁNH GIÁ (REVIEWS) MÔI GIỚI
-- Chạy đoạn script này trong Supabase Dashboard > SQL Editor
-- ==============================================================================

-- 1. Bổ sung các chỉ số KPI vào bảng brokers
ALTER TABLE public.brokers 
  ADD COLUMN IF NOT EXISTS kpi_target_deals INT DEFAULT 3,
  ADD COLUMN IF NOT EXISTS kpi_target_leads INT DEFAULT 15,
  ADD COLUMN IF NOT EXISTS kpi_target_appts INT DEFAULT 10,
  ADD COLUMN IF NOT EXISTS total_reviews_count INT DEFAULT 0;

-- 2. Tạo bảng đánh giá môi giới (broker_reviews)
CREATE TABLE IF NOT EXISTS public.broker_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  broker_id UUID REFERENCES public.brokers(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  criteria_attitude INT DEFAULT 5 CHECK (criteria_attitude BETWEEN 1 AND 5), -- Thái độ & Tác phong
  criteria_expertise INT DEFAULT 5 CHECK (criteria_expertise BETWEEN 1 AND 5), -- Am hiểu quy hoạch & pháp lý
  criteria_negotiation INT DEFAULT 5 CHECK (criteria_negotiation BETWEEN 1 AND 5), -- Kỹ năng thương lượng giá
  comment TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Bật RLS và cấp quyền cho bảng broker_reviews
ALTER TABLE public.broker_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read broker reviews" ON public.broker_reviews;
CREATE POLICY "Public read broker reviews" ON public.broker_reviews
FOR SELECT TO anon, authenticated USING (is_approved = true OR public.is_admin());

DROP POLICY IF EXISTS "Public insert broker reviews" ON public.broker_reviews;
CREATE POLICY "Public insert broker reviews" ON public.broker_reviews
FOR INSERT TO anon, authenticated WITH CHECK (
  char_length(customer_name) >= 2 
  AND char_length(comment) >= 5 
  AND rating BETWEEN 1 AND 5
);

DROP POLICY IF EXISTS "Admin manage broker reviews" ON public.broker_reviews;
CREATE POLICY "Admin manage broker reviews" ON public.broker_reviews
FOR ALL TO authenticated USING (public.is_admin());

-- 4. Trigger tự động tính lại điểm trung bình rating và số lượt review của môi giới
CREATE OR REPLACE FUNCTION public.refresh_broker_rating()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_broker_id UUID;
BEGIN
  v_broker_id := COALESCE(NEW.broker_id, OLD.broker_id);
  UPDATE public.brokers
  SET 
    rating = COALESCE((SELECT ROUND(AVG(rating)::numeric, 1) FROM public.broker_reviews WHERE broker_id = v_broker_id AND is_approved = true), 5.0),
    total_reviews_count = (SELECT COUNT(*)::int FROM public.broker_reviews WHERE broker_id = v_broker_id AND is_approved = true),
    updated_at = now()
  WHERE id = v_broker_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_refresh_broker_rating ON public.broker_reviews;
CREATE TRIGGER trg_refresh_broker_rating
AFTER INSERT OR UPDATE OR DELETE ON public.broker_reviews
FOR EACH ROW EXECUTE PROCEDURE public.refresh_broker_rating();

-- 5. Seed một số đánh giá review mẫu thực tế cho môi giới
INSERT INTO public.broker_reviews (broker_id, customer_name, customer_phone, rating, criteria_attitude, criteria_expertise, criteria_negotiation, comment)
SELECT id, 'Anh Tuấn - Biên Hòa', '0912***678', 5, 5, 5, 5, 'Bạn tư vấn rất am hiểu quy hoạch khu Aqua City, dẫn xem nhà đúng giờ và đàm phán giảm được 200 triệu với chủ nhà.'
FROM public.brokers WHERE phone = '0918123456' LIMIT 1;

INSERT INTO public.broker_reviews (broker_id, customer_name, customer_phone, rating, criteria_attitude, criteria_expertise, criteria_negotiation, comment)
SELECT id, 'Chị Ngọc Mai - Thủ Đức', '0983***112', 5, 5, 5, 4, 'Hồ sơ pháp lý căn hộ The River được kiểm tra kỹ lưỡng trước khi đặt cọc, phong cách làm việc chuyên nghiệp, chu đáo.'
FROM public.brokers WHERE phone = '0909876543' LIMIT 1;
