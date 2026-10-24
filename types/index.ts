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
  bio: string;
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
  status: 'available' | 'reserved' | 'sold';
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
