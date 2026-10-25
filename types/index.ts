export type Broker = {
  id: string;
  user_id?: string;
  full_name: string;
  phone: string;
  zalo_phone: string;
  avatar_url: string;
  license_number?: string;
  coverage_areas: string[];
  specializations: string[];
  experience_years: number;
  is_verified: boolean;
  rating: number;
  total_reviews_count?: number;
  bio: string;
  is_admin?: boolean;
  status?: string;
  kpi_target_deals?: number;
  kpi_target_leads?: number;
  kpi_target_appts?: number;
  created_at: string;
};

export type Property = {
  id: string;
  broker_id: string;
  title: string;
  property_type: 'Căn hộ' | 'Nhà phố' | 'Biệt thự' | 'Đất nền' | 'Kho xưởng';
  city: 'TP.HCM' | 'Đồng Nai';
  district: string;
  address: string;
  price: number;
  price_display: string;
  area_m2: number;
  bedrooms: number;
  bathrooms: number;
  legal_status: string;
  direction: string;
  description: string;
  cover_image: string;
  images: string[];
  is_featured: boolean;
  is_exclusive: boolean;
  status: 'available' | 'reserved' | 'sold' | 'pending';
  views_count: number;
  created_at: string;
  brokers?: Broker;
};

export type Lead = {
  id: string;
  property_id?: string;
  broker_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  note?: string;
  stage: 'new' | 'contacted' | 'scheduled' | 'negotiating' | 'won' | 'lost';
  created_at: string;
  properties?: Property;
};

export type Appointment = {
  id: string;
  property_id: string;
  broker_id: string;
  customer_name: string;
  customer_phone: string;
  appointment_date: string;
  time_slot: string;
  note?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
  properties?: Property;
};

export type BrokerReview = {
  id: string;
  broker_id: string;
  customer_name: string;
  customer_phone?: string;
  rating: number;
  criteria_attitude: number;
  criteria_expertise: number;
  criteria_negotiation: number;
  comment: string;
  is_approved: boolean;
  created_at: string;
  brokers?: Broker;
};
