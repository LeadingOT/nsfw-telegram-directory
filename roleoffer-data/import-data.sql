-- Import compensation benchmark data

-- Insert comp_data for Software Engineer
INSERT INTO comp_data (role_id, location_id, stage_id, base_salary_p25, base_salary_p50, base_salary_p75, equity_pct_p25, equity_pct_p50, equity_pct_p75, data_sources, sample_size)
SELECT 
  r.id as role_id,
  l.id as location_id,
  s.id as stage_id,
  137500, 168750, 206250,
  0.050, 0.100, 0.200,
  ARRAY['mock_h1b', 'carta_public'],
  50
FROM roles r, locations l, stages s
WHERE r.title = 'Software Engineer' AND l.city = 'San Francisco' AND s.name = 'Seed';

INSERT INTO comp_data (role_id, location_id, stage_id, base_salary_p25, base_salary_p50, base_salary_p75, equity_pct_p25, equity_pct_p50, equity_pct_p75, data_sources, sample_size)
SELECT 
  r.id, l.id, s.id,
  137500, 168750, 206250,
  0.030, 0.070, 0.150,
  ARRAY['mock_h1b', 'carta_public'],
  50
FROM roles r, locations l, stages s
WHERE r.title = 'Software Engineer' AND l.city = 'San Francisco' AND s.name = 'Series A';

INSERT INTO comp_data (role_id, location_id, stage_id, base_salary_p25, base_salary_p50, base_salary_p75, equity_pct_p25, equity_pct_p50, equity_pct_p75, data_sources, sample_size)
SELECT 
  r.id, l.id, s.id,
  137500, 168750, 206250,
  0.020, 0.050, 0.100,
  ARRAY['mock_h1b', 'carta_public'],
  50
FROM roles r, locations l, stages s
WHERE r.title = 'Software Engineer' AND l.city = 'San Francisco' AND s.name = 'Series B';

-- Senior Software Engineer
INSERT INTO comp_data (role_id, location_id, stage_id, base_salary_p25, base_salary_p50, base_salary_p75, equity_pct_p25, equity_pct_p50, equity_pct_p75, data_sources, sample_size)
SELECT 
  r.id, l.id, s.id,
  181250, 218750, 262500,
  0.100, 0.250, 0.500,
  ARRAY['mock_h1b', 'carta_public'],
  40
FROM roles r, locations l, stages s
WHERE r.title = 'Senior Software Engineer' AND l.city = 'San Francisco' AND s.name = 'Seed';

INSERT INTO comp_data (role_id, location_id, stage_id, base_salary_p25, base_salary_p50, base_salary_p75, equity_pct_p25, equity_pct_p50, equity_pct_p75, data_sources, sample_size)
SELECT 
  r.id, l.id, s.id,
  181250, 218750, 262500,
  0.050, 0.150, 0.300,
  ARRAY['mock_h1b', 'carta_public'],
  40
FROM roles r, locations l, stages s
WHERE r.title = 'Senior Software Engineer' AND l.city = 'San Francisco' AND s.name = 'Series A';

INSERT INTO comp_data (role_id, location_id, stage_id, base_salary_p25, base_salary_p50, base_salary_p75, equity_pct_p25, equity_pct_p50, equity_pct_p75, data_sources, sample_size)
SELECT 
  r.id, l.id, s.id,
  181250, 218750, 262500,
  0.030, 0.100, 0.200,
  ARRAY['mock_h1b', 'carta_public'],
  40
FROM roles r, locations l, stages s
WHERE r.title = 'Senior Software Engineer' AND l.city = 'San Francisco' AND s.name = 'Series B';

-- Staff Software Engineer
INSERT INTO comp_data (role_id, location_id, stage_id, base_salary_p25, base_salary_p50, base_salary_p75, equity_pct_p25, equity_pct_p50, equity_pct_p75, data_sources, sample_size)
SELECT 
  r.id, l.id, s.id,
  225000, 268750, 325000,
  0.150, 0.350, 0.700,
  ARRAY['mock_h1b', 'carta_public'],
  30
FROM roles r, locations l, stages s
WHERE r.title = 'Staff Software Engineer' AND l.city = 'San Francisco' AND s.name = 'Seed';

INSERT INTO comp_data (role_id, location_id, stage_id, base_salary_p25, base_salary_p50, base_salary_p75, equity_pct_p25, equity_pct_p50, equity_pct_p75, data_sources, sample_size)
SELECT 
  r.id, l.id, s.id,
  225000, 268750, 325000,
  0.080, 0.200, 0.400,
  ARRAY['mock_h1b', 'carta_public'],
  30
FROM roles r, locations l, stages s
WHERE r.title = 'Staff Software Engineer' AND l.city = 'San Francisco' AND s.name = 'Series A';

-- New York - Software Engineer
INSERT INTO comp_data (role_id, location_id, stage_id, base_salary_p25, base_salary_p50, base_salary_p75, equity_pct_p25, equity_pct_p50, equity_pct_p75, data_sources, sample_size)
SELECT 
  r.id, l.id, s.id,
  132000, 162000, 198000,
  0.050, 0.100, 0.200,
  ARRAY['mock_h1b', 'carta_public'],
  45
FROM roles r, locations l, stages s
WHERE r.title = 'Software Engineer' AND l.city = 'New York' AND s.name = 'Series A';

-- Product Manager
INSERT INTO comp_data (role_id, location_id, stage_id, base_salary_p25, base_salary_p50, base_salary_p75, equity_pct_p25, equity_pct_p50, equity_pct_p75, data_sources, sample_size)
SELECT 
  r.id, l.id, s.id,
  145000, 175000, 210000,
  0.080, 0.150, 0.300,
  ARRAY['mock_h1b', 'carta_public'],
  35
FROM roles r, locations l, stages s
WHERE r.title = 'Product Manager' AND l.city = 'San Francisco' AND s.name = 'Seed';

INSERT INTO comp_data (role_id, location_id, stage_id, base_salary_p25, base_salary_p50, base_salary_p75, equity_pct_p25, equity_pct_p50, equity_pct_p75, data_sources, sample_size)
SELECT 
  r.id, l.id, s.id,
  145000, 175000, 210000,
  0.050, 0.100, 0.200,
  ARRAY['mock_h1b', 'carta_public'],
  35
FROM roles r, locations l, stages s
WHERE r.title = 'Product Manager' AND l.city = 'San Francisco' AND s.name = 'Series A';
