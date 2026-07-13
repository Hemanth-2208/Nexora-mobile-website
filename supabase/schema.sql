-- Supabase Database Schema

-- Enable trigger for updating updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create Mobiles Table
CREATE TABLE IF NOT EXISTS mobiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    price NUMERIC NOT NULL CHECK (price > 0),
    discount_price NUMERIC CHECK (discount_price IS NULL OR (discount_price > 0 AND discount_price < price)),
    ram TEXT NOT NULL,
    storage TEXT NOT NULL,
    processor TEXT NOT NULL,
    display TEXT NOT NULL,
    battery TEXT NOT NULL,
    camera TEXT NOT NULL,
    description TEXT NOT NULL,
    images TEXT[] NOT NULL CHECK (cardinality(images) >= 1 AND cardinality(images) <= 5),
    stock_status TEXT NOT NULL DEFAULT 'In Stock' CHECK (stock_status IN ('In Stock', 'Limited Stock', 'Out of Stock')),
    hidden BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Trigger for updating mobiles.updated_at
CREATE OR REPLACE TRIGGER update_mobiles_updated_at
    BEFORE UPDATE ON mobiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating IN (1, 2, 3, 4, 5)),
    review TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_mobiles_hidden ON mobiles(hidden) WHERE NOT hidden;
CREATE INDEX IF NOT EXISTS idx_mobiles_brand ON mobiles(brand);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE mobiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Mobiles RLS Policies
CREATE POLICY "Allow public select for non-hidden mobiles" 
    ON mobiles 
    FOR SELECT 
    USING (NOT hidden);

CREATE POLICY "Allow authenticated users full CRUD on mobiles" 
    ON mobiles 
    TO authenticated 
    USING (true) 
    WITH CHECK (true);

-- Reviews RLS Policies
CREATE POLICY "Allow public select for reviews" 
    ON reviews 
    FOR SELECT 
    USING (true);

CREATE POLICY "Allow authenticated users full CRUD on reviews" 
    ON reviews 
    TO authenticated 
    USING (true) 
    WITH CHECK (true);
