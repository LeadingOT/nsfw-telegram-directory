-- RoleOffer.com Supabase Schema
-- MVP Database Design

-- 1. Roles taxonomy
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL, -- Engineering, Product, Design, etc.
  level TEXT NOT NULL, -- IC1-IC6, M1-M3
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_roles_category ON roles(category);
CREATE INDEX idx_roles_level ON roles(level);

-- 2. Locations
CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  country TEXT DEFAULT 'USA',
  metro_area TEXT, -- e.g., "Bay Area"
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_locations_city ON locations(city);
CREATE UNIQUE INDEX idx_locations_city_state ON locations(city, state);

-- 3. Company stages
CREATE TABLE stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE, -- Seed, Series A, Series B, Series C
  order_num INT NOT NULL, -- for sorting
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Compensation data (main table)
CREATE TABLE comp_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID REFERENCES roles(id),
  location_id UUID REFERENCES locations(id),
  stage_id UUID REFERENCES stages(id),
  
  -- Salary benchmarks (in USD)
  base_salary_p25 INT NOT NULL,
  base_salary_p50 INT NOT NULL,
  base_salary_p75 INT NOT NULL,
  
  -- Equity benchmarks (as percentage)
  equity_pct_p25 DECIMAL(5,3), -- e.g., 0.050 = 0.05%
  equity_pct_p50 DECIMAL(5,3),
  equity_pct_p75 DECIMAL(5,3),
  
  -- Metadata
  data_sources TEXT[], -- ["h1b", "levels.fyi", "bls"]
  sample_size INT, -- number of data points used
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_comp_data_role ON comp_data(role_id);
CREATE INDEX idx_comp_data_location ON comp_data(location_id);
CREATE INDEX idx_comp_data_stage ON comp_data(stage_id);
CREATE UNIQUE INDEX idx_comp_data_unique ON comp_data(role_id, location_id, stage_id);

-- 5. Generated offers (for analytics)
CREATE TABLE generated_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Input parameters
  role_title TEXT NOT NULL,
  level TEXT NOT NULL,
  location TEXT NOT NULL,
  stage TEXT NOT NULL,
  
  -- Generated values
  base_salary INT NOT NULL,
  equity_pct DECIMAL(5,3),
  total_comp_estimate INT,
  
  -- PDF storage
  pdf_url TEXT, -- Supabase storage URL
  
  -- Payment info
  paid BOOLEAN DEFAULT FALSE,
  payment_amount INT, -- in cents
  payment_id TEXT,
  
  -- Analytics
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_generated_offers_created ON generated_offers(created_at DESC);
CREATE INDEX idx_generated_offers_paid ON generated_offers(paid);

-- 6. Free tool usage (for lead tracking)
CREATE TABLE free_tool_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_name TEXT NOT NULL, -- "offer_calculator", "is_my_offer_fair", "equity_calculator"
  
  -- Input data (JSON for flexibility)
  input_data JSONB,
  
  -- Analytics
  converted_to_paid BOOLEAN DEFAULT FALSE,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_free_tool_usage_tool ON free_tool_usage(tool_name);
CREATE INDEX idx_free_tool_usage_created ON free_tool_usage(created_at DESC);

-- Insert initial data
INSERT INTO stages (name, order_num) VALUES
  ('Pre-Seed', 0),
  ('Seed', 1),
  ('Series A', 2),
  ('Series B', 3),
  ('Series C', 4),
  ('Series D+', 5);

-- Sample roles (expand later)
INSERT INTO roles (title, category, level) VALUES
  ('Software Engineer', 'Engineering', 'IC2'),
  ('Senior Software Engineer', 'Engineering', 'IC4'),
  ('Staff Software Engineer', 'Engineering', 'IC5'),
  ('Principal Software Engineer', 'Engineering', 'IC6'),
  ('Engineering Manager', 'Engineering', 'M1'),
  ('Senior Engineering Manager', 'Engineering', 'M2'),
  ('Product Manager', 'Product', 'IC3'),
  ('Senior Product Manager', 'Product', 'IC4'),
  ('Data Scientist', 'Data', 'IC3'),
  ('Senior Data Scientist', 'Data', 'IC4');

-- Sample locations (expand later)
INSERT INTO locations (city, state, metro_area) VALUES
  ('San Francisco', 'CA', 'Bay Area'),
  ('San Jose', 'CA', 'Bay Area'),
  ('Palo Alto', 'CA', 'Bay Area'),
  ('New York', 'NY', 'NYC Metro'),
  ('Seattle', 'WA', 'Seattle Metro'),
  ('Austin', 'TX', 'Austin Metro'),
  ('Boston', 'MA', 'Boston Metro'),
  ('Los Angeles', 'CA', 'LA Metro'),
  ('Chicago', 'IL', 'Chicago Metro'),
  ('Denver', 'CO', 'Denver Metro');

-- RLS (Row Level Security) - Enable for production
-- For MVP, keeping it simple without RLS
