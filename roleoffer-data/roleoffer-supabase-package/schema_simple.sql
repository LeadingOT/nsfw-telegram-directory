-- RoleOffer Simple Schema (matches CSV structure)
-- Denormalized for fast queries, matches CSV exactly

CREATE TABLE IF NOT EXISTS comp_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stage TEXT NOT NULL,
  stage_label TEXT NOT NULL,
  location TEXT NOT NULL,
  location_label TEXT NOT NULL,
  role TEXT NOT NULL,
  role_label TEXT NOT NULL,
  level TEXT NOT NULL,
  level_label TEXT NOT NULL,
  level_name TEXT NOT NULL,
  percentile TEXT NOT NULL,
  salary INTEGER NOT NULL,
  total_cash INTEGER NOT NULL,
  equity_pct DECIMAL(6,4) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_comp_data_stage ON comp_data(stage);
CREATE INDEX IF NOT EXISTS idx_comp_data_location ON comp_data(location);
CREATE INDEX IF NOT EXISTS idx_comp_data_role ON comp_data(role);
CREATE INDEX IF NOT EXISTS idx_comp_data_level ON comp_data(level);
CREATE INDEX IF NOT EXISTS idx_comp_data_percentile ON comp_data(percentile);

-- Composite index for common queries
CREATE INDEX IF NOT EXISTS idx_comp_data_lookup 
  ON comp_data(role, level, stage, location, percentile);

COMMENT ON TABLE comp_data IS 'RoleOffer compensation benchmarks - 58,752 rows covering 6 stages × 8 locations × 5 roles × 9 levels × 4 percentiles';
