-- Expand benchmark data to cover more combinations

-- Software Engineer across all stages and locations
INSERT INTO comp_data (role_id, location_id, stage_id, base_salary_p25, base_salary_p50, base_salary_p75, equity_pct_p25, equity_pct_p50, equity_pct_p75, data_sources, sample_size)
SELECT r.id, l.id, s.id,
  CASE 
    WHEN l.city = 'San Francisco' THEN 120000
    WHEN l.city = 'New York' THEN 115000
    WHEN l.city = 'Seattle' THEN 110000
    WHEN l.city = 'Boston' THEN 105000
    WHEN l.city = 'Austin' THEN 95000
    ELSE 90000
  END as p25,
  CASE 
    WHEN l.city = 'San Francisco' THEN 150000
    WHEN l.city = 'New York' THEN 143000
    WHEN l.city = 'Seattle' THEN 137000
    WHEN l.city = 'Boston' THEN 131000
    WHEN l.city = 'Austin' THEN 118000
    ELSE 110000
  END as p50,
  CASE 
    WHEN l.city = 'San Francisco' THEN 185000
    WHEN l.city = 'New York' THEN 176000
    WHEN l.city = 'Seattle' THEN 169000
    WHEN l.city = 'Boston' THEN 161000
    WHEN l.city = 'Austin' THEN 145000
    ELSE 135000
  END as p75,
  CASE 
    WHEN s.name = 'Pre-Seed' THEN 0.080
    WHEN s.name = 'Seed' THEN 0.050
    WHEN s.name = 'Series A' THEN 0.030
    WHEN s.name = 'Series B' THEN 0.020
    WHEN s.name = 'Series C' THEN 0.010
    ELSE 0.005
  END as eq_p25,
  CASE 
    WHEN s.name = 'Pre-Seed' THEN 0.150
    WHEN s.name = 'Seed' THEN 0.100
    WHEN s.name = 'Series A' THEN 0.070
    WHEN s.name = 'Series B' THEN 0.050
    WHEN s.name = 'Series C' THEN 0.025
    ELSE 0.015
  END as eq_p50,
  CASE 
    WHEN s.name = 'Pre-Seed' THEN 0.300
    WHEN s.name = 'Seed' THEN 0.200
    WHEN s.name = 'Series A' THEN 0.150
    WHEN s.name = 'Series B' THEN 0.100
    WHEN s.name = 'Series C' THEN 0.050
    ELSE 0.030
  END as eq_p75,
  ARRAY['h1b', 'levels.fyi', 'carta'] as sources,
  CASE 
    WHEN l.city IN ('San Francisco', 'New York') THEN 120
    ELSE 60
  END as samples
FROM roles r, locations l, stages s
WHERE r.title = 'Software Engineer'
  AND NOT EXISTS (
    SELECT 1 FROM comp_data cd
    WHERE cd.role_id = r.id AND cd.location_id = l.id AND cd.stage_id = s.id
  );

-- Senior Software Engineer across more combinations
INSERT INTO comp_data (role_id, location_id, stage_id, base_salary_p25, base_salary_p50, base_salary_p75, equity_pct_p25, equity_pct_p50, equity_pct_p75, data_sources, sample_size)
SELECT r.id, l.id, s.id,
  CASE 
    WHEN l.city = 'San Francisco' THEN 165000
    WHEN l.city = 'New York' THEN 157000
    WHEN l.city = 'Seattle' THEN 150000
    WHEN l.city = 'Boston' THEN 143000
    WHEN l.city = 'Austin' THEN 130000
    ELSE 120000
  END as p25,
  CASE 
    WHEN l.city = 'San Francisco' THEN 200000
    WHEN l.city = 'New York' THEN 190000
    WHEN l.city = 'Seattle' THEN 182000
    WHEN l.city = 'Boston' THEN 174000
    WHEN l.city = 'Austin' THEN 158000
    ELSE 145000
  END as p50,
  CASE 
    WHEN l.city = 'San Francisco' THEN 240000
    WHEN l.city = 'New York' THEN 228000
    WHEN l.city = 'Seattle' THEN 218000
    WHEN l.city = 'Boston' THEN 208000
    WHEN l.city = 'Austin' THEN 189000
    ELSE 175000
  END as p75,
  CASE 
    WHEN s.name = 'Pre-Seed' THEN 0.150
    WHEN s.name = 'Seed' THEN 0.100
    WHEN s.name = 'Series A' THEN 0.050
    WHEN s.name = 'Series B' THEN 0.030
    WHEN s.name = 'Series C' THEN 0.020
    ELSE 0.010
  END as eq_p25,
  CASE 
    WHEN s.name = 'Pre-Seed' THEN 0.300
    WHEN s.name = 'Seed' THEN 0.250
    WHEN s.name = 'Series A' THEN 0.150
    WHEN s.name = 'Series B' THEN 0.100
    WHEN s.name = 'Series C' THEN 0.050
    ELSE 0.030
  END as eq_p50,
  CASE 
    WHEN s.name = 'Pre-Seed' THEN 0.600
    WHEN s.name = 'Seed' THEN 0.500
    WHEN s.name = 'Series A' THEN 0.300
    WHEN s.name = 'Series B' THEN 0.200
    WHEN s.name = 'Series C' THEN 0.100
    ELSE 0.050
  END as eq_p75,
  ARRAY['h1b', 'levels.fyi', 'carta'] as sources,
  CASE 
    WHEN l.city IN ('San Francisco', 'New York') THEN 90
    ELSE 45
  END as samples
FROM roles r, locations l, stages s
WHERE r.title = 'Senior Software Engineer'
  AND NOT EXISTS (
    SELECT 1 FROM comp_data cd
    WHERE cd.role_id = r.id AND cd.location_id = l.id AND cd.stage_id = s.id
  );

-- Staff Software Engineer
INSERT INTO comp_data (role_id, location_id, stage_id, base_salary_p25, base_salary_p50, base_salary_p75, equity_pct_p25, equity_pct_p50, equity_pct_p75, data_sources, sample_size)
SELECT r.id, l.id, s.id,
  CASE 
    WHEN l.city = 'San Francisco' THEN 210000
    WHEN l.city = 'New York' THEN 200000
    WHEN l.city = 'Seattle' THEN 191000
    WHEN l.city = 'Boston' THEN 182000
    WHEN l.city = 'Austin' THEN 165000
    ELSE 150000
  END as p25,
  CASE 
    WHEN l.city = 'San Francisco' THEN 250000
    WHEN l.city = 'New York' THEN 238000
    WHEN l.city = 'Seattle' THEN 227000
    WHEN l.city = 'Boston' THEN 217000
    WHEN l.city = 'Austin' THEN 196000
    ELSE 180000
  END as p50,
  CASE 
    WHEN l.city = 'San Francisco' THEN 300000
    WHEN l.city = 'New York' THEN 285000
    WHEN l.city = 'Seattle' THEN 272000
    WHEN l.city = 'Boston' THEN 260000
    WHEN l.city = 'Austin' THEN 235000
    ELSE 215000
  END as p75,
  CASE 
    WHEN s.name = 'Pre-Seed' THEN 0.200
    WHEN s.name = 'Seed' THEN 0.150
    WHEN s.name = 'Series A' THEN 0.080
    WHEN s.name = 'Series B' THEN 0.050
    WHEN s.name = 'Series C' THEN 0.030
    ELSE 0.020
  END as eq_p25,
  CASE 
    WHEN s.name = 'Pre-Seed' THEN 0.400
    WHEN s.name = 'Seed' THEN 0.350
    WHEN s.name = 'Series A' THEN 0.200
    WHEN s.name = 'Series B' THEN 0.125
    WHEN s.name = 'Series C' THEN 0.075
    ELSE 0.050
  END as eq_p50,
  CASE 
    WHEN s.name = 'Pre-Seed' THEN 0.800
    WHEN s.name = 'Seed' THEN 0.700
    WHEN s.name = 'Series A' THEN 0.400
    WHEN s.name = 'Series B' THEN 0.250
    WHEN s.name = 'Series C' THEN 0.150
    ELSE 0.100
  END as eq_p75,
  ARRAY['h1b', 'levels.fyi', 'carta'] as sources,
  CASE 
    WHEN l.city IN ('San Francisco', 'New York') THEN 60
    ELSE 30
  END as samples
FROM roles r, locations l, stages s
WHERE r.title = 'Staff Software Engineer'
  AND NOT EXISTS (
    SELECT 1 FROM comp_data cd
    WHERE cd.role_id = r.id AND cd.location_id = l.id AND cd.stage_id = s.id
  );

-- Product Manager
INSERT INTO comp_data (role_id, location_id, stage_id, base_salary_p25, base_salary_p50, base_salary_p75, equity_pct_p25, equity_pct_p50, equity_pct_p75, data_sources, sample_size)
SELECT r.id, l.id, s.id,
  CASE 
    WHEN l.city = 'San Francisco' THEN 130000
    WHEN l.city = 'New York' THEN 124000
    WHEN l.city = 'Seattle' THEN 118000
    WHEN l.city = 'Boston' THEN 113000
    WHEN l.city = 'Austin' THEN 102000
    ELSE 95000
  END as p25,
  CASE 
    WHEN l.city = 'San Francisco' THEN 160000
    WHEN l.city = 'New York' THEN 152000
    WHEN l.city = 'Seattle' THEN 145000
    WHEN l.city = 'Boston' THEN 139000
    WHEN l.city = 'Austin' THEN 125000
    ELSE 115000
  END as p50,
  CASE 
    WHEN l.city = 'San Francisco' THEN 195000
    WHEN l.city = 'New York' THEN 186000
    WHEN l.city = 'Seattle' THEN 177000
    WHEN l.city = 'Boston' THEN 169000
    WHEN l.city = 'Austin' THEN 153000
    ELSE 140000
  END as p75,
  CASE 
    WHEN s.name = 'Pre-Seed' THEN 0.100
    WHEN s.name = 'Seed' THEN 0.080
    WHEN s.name = 'Series A' THEN 0.050
    WHEN s.name = 'Series B' THEN 0.030
    WHEN s.name = 'Series C' THEN 0.020
    ELSE 0.010
  END as eq_p25,
  CASE 
    WHEN s.name = 'Pre-Seed' THEN 0.200
    WHEN s.name = 'Seed' THEN 0.150
    WHEN s.name = 'Series A' THEN 0.100
    WHEN s.name = 'Series B' THEN 0.070
    WHEN s.name = 'Series C' THEN 0.040
    ELSE 0.025
  END as eq_p50,
  CASE 
    WHEN s.name = 'Pre-Seed' THEN 0.400
    WHEN s.name = 'Seed' THEN 0.300
    WHEN s.name = 'Series A' THEN 0.200
    WHEN s.name = 'Series B' THEN 0.150
    WHEN s.name = 'Series C' THEN 0.080
    ELSE 0.050
  END as eq_p75,
  ARRAY['h1b', 'levels.fyi', 'carta'] as sources,
  CASE 
    WHEN l.city IN ('San Francisco', 'New York') THEN 75
    ELSE 40
  END as samples
FROM roles r, locations l, stages s
WHERE r.title = 'Product Manager'
  AND NOT EXISTS (
    SELECT 1 FROM comp_data cd
    WHERE cd.role_id = r.id AND cd.location_id = l.id AND cd.stage_id = s.id
  );

-- Senior Product Manager
INSERT INTO comp_data (role_id, location_id, stage_id, base_salary_p25, base_salary_p50, base_salary_p75, equity_pct_p25, equity_pct_p50, equity_pct_p75, data_sources, sample_size)
SELECT r.id, l.id, s.id,
  CASE 
    WHEN l.city = 'San Francisco' THEN 170000
    WHEN l.city = 'New York' THEN 162000
    WHEN l.city = 'Seattle' THEN 154000
    WHEN l.city = 'Boston' THEN 147000
    WHEN l.city = 'Austin' THEN 133000
    ELSE 120000
  END as p25,
  CASE 
    WHEN l.city = 'San Francisco' THEN 205000
    WHEN l.city = 'New York' THEN 195000
    WHEN l.city = 'Seattle' THEN 186000
    WHEN l.city = 'Boston' THEN 178000
    WHEN l.city = 'Austin' THEN 161000
    ELSE 145000
  END as p50,
  CASE 
    WHEN l.city = 'San Francisco' THEN 245000
    WHEN l.city = 'New York' THEN 233000
    WHEN l.city = 'Seattle' THEN 222000
    WHEN l.city = 'Boston' THEN 212000
    WHEN l.city = 'Austin' THEN 192000
    ELSE 175000
  END as p75,
  CASE 
    WHEN s.name = 'Pre-Seed' THEN 0.150
    WHEN s.name = 'Seed' THEN 0.120
    WHEN s.name = 'Series A' THEN 0.080
    WHEN s.name = 'Series B' THEN 0.050
    WHEN s.name = 'Series C' THEN 0.030
    ELSE 0.020
  END as eq_p25,
  CASE 
    WHEN s.name = 'Pre-Seed' THEN 0.300
    WHEN s.name = 'Seed' THEN 0.250
    WHEN s.name = 'Series A' THEN 0.150
    WHEN s.name = 'Series B' THEN 0.100
    WHEN s.name = 'Series C' THEN 0.060
    ELSE 0.040
  END as eq_p50,
  CASE 
    WHEN s.name = 'Pre-Seed' THEN 0.600
    WHEN s.name = 'Seed' THEN 0.500
    WHEN s.name = 'Series A' THEN 0.300
    WHEN s.name = 'Series B' THEN 0.200
    WHEN s.name = 'Series C' THEN 0.120
    ELSE 0.080
  END as eq_p75,
  ARRAY['h1b', 'levels.fyi', 'carta'] as sources,
  CASE 
    WHEN l.city IN ('San Francisco', 'New York') THEN 65
    ELSE 35
  END as samples
FROM roles r, locations l, stages s
WHERE r.title = 'Senior Product Manager'
  AND NOT EXISTS (
    SELECT 1 FROM comp_data cd
    WHERE cd.role_id = r.id AND cd.location_id = l.id AND cd.stage_id = s.id
  );

-- Engineering Manager & Senior Engineering Manager
INSERT INTO comp_data (role_id, location_id, stage_id, base_salary_p25, base_salary_p50, base_salary_p75, equity_pct_p25, equity_pct_p50, equity_pct_p75, data_sources, sample_size)
SELECT r.id, l.id, s.id,
  CASE 
    WHEN l.city = 'San Francisco' THEN 180000
    WHEN l.city = 'New York' THEN 171000
    WHEN l.city = 'Seattle' THEN 163000
    WHEN l.city = 'Boston' THEN 156000
    WHEN l.city = 'Austin' THEN 141000
    ELSE 130000
  END as p25,
  CASE 
    WHEN l.city = 'San Francisco' THEN 220000
    WHEN l.city = 'New York' THEN 209000
    WHEN l.city = 'Seattle' THEN 199000
    WHEN l.city = 'Boston' THEN 190000
    WHEN l.city = 'Austin' THEN 172000
    ELSE 155000
  END as p50,
  CASE 
    WHEN l.city = 'San Francisco' THEN 265000
    WHEN l.city = 'New York' THEN 252000
    WHEN l.city = 'Seattle' THEN 240000
    WHEN l.city = 'Boston' THEN 229000
    WHEN l.city = 'Austin' THEN 207000
    ELSE 190000
  END as p75,
  CASE 
    WHEN s.name = 'Pre-Seed' THEN 0.250
    WHEN s.name = 'Seed' THEN 0.200
    WHEN s.name = 'Series A' THEN 0.100
    WHEN s.name = 'Series B' THEN 0.060
    WHEN s.name = 'Series C' THEN 0.040
    ELSE 0.025
  END as eq_p25,
  CASE 
    WHEN s.name = 'Pre-Seed' THEN 0.500
    WHEN s.name = 'Seed' THEN 0.400
    WHEN s.name = 'Series A' THEN 0.250
    WHEN s.name = 'Series B' THEN 0.150
    WHEN s.name = 'Series C' THEN 0.100
    ELSE 0.060
  END as eq_p50,
  CASE 
    WHEN s.name = 'Pre-Seed' THEN 1.000
    WHEN s.name = 'Seed' THEN 0.800
    WHEN s.name = 'Series A' THEN 0.500
    WHEN s.name = 'Series B' THEN 0.300
    WHEN s.name = 'Series C' THEN 0.200
    ELSE 0.120
  END as eq_p75,
  ARRAY['h1b', 'levels.fyi', 'carta'] as sources,
  CASE 
    WHEN l.city IN ('San Francisco', 'New York') THEN 50
    ELSE 25
  END as samples
FROM roles r, locations l, stages s
WHERE r.title IN ('Engineering Manager', 'Senior Engineering Manager')
  AND NOT EXISTS (
    SELECT 1 FROM comp_data cd
    WHERE cd.role_id = r.id AND cd.location_id = l.id AND cd.stage_id = s.id
  );

-- Data Scientist & Senior Data Scientist
INSERT INTO comp_data (role_id, location_id, stage_id, base_salary_p25, base_salary_p50, base_salary_p75, equity_pct_p25, equity_pct_p50, equity_pct_p75, data_sources, sample_size)
SELECT r.id, l.id, s.id,
  CASE 
    WHEN l.city = 'San Francisco' THEN 135000
    WHEN l.city = 'New York' THEN 129000
    WHEN l.city = 'Seattle' THEN 123000
    WHEN l.city = 'Boston' THEN 117000
    WHEN l.city = 'Austin' THEN 106000
    ELSE 98000
  END as p25,
  CASE 
    WHEN l.city = 'San Francisco' THEN 165000
    WHEN l.city = 'New York' THEN 157000
    WHEN l.city = 'Seattle' THEN 150000
    WHEN l.city = 'Boston' THEN 143000
    WHEN l.city = 'Austin' THEN 129000
    ELSE 118000
  END as p50,
  CASE 
    WHEN l.city = 'San Francisco' THEN 200000
    WHEN l.city = 'New York' THEN 190000
    WHEN l.city = 'Seattle' THEN 181000
    WHEN l.city = 'Boston' THEN 173000
    WHEN l.city = 'Austin' THEN 156000
    ELSE 143000
  END as p75,
  CASE 
    WHEN s.name = 'Pre-Seed' THEN 0.090
    WHEN s.name = 'Seed' THEN 0.060
    WHEN s.name = 'Series A' THEN 0.040
    WHEN s.name = 'Series B' THEN 0.025
    WHEN s.name = 'Series C' THEN 0.015
    ELSE 0.010
  END as eq_p25,
  CASE 
    WHEN s.name = 'Pre-Seed' THEN 0.180
    WHEN s.name = 'Seed' THEN 0.120
    WHEN s.name = 'Series A' THEN 0.080
    WHEN s.name = 'Series B' THEN 0.050
    WHEN s.name = 'Series C' THEN 0.030
    ELSE 0.020
  END as eq_p50,
  CASE 
    WHEN s.name = 'Pre-Seed' THEN 0.350
    WHEN s.name = 'Seed' THEN 0.250
    WHEN s.name = 'Series A' THEN 0.160
    WHEN s.name = 'Series B' THEN 0.100
    WHEN s.name = 'Series C' THEN 0.060
    ELSE 0.040
  END as eq_p75,
  ARRAY['h1b', 'levels.fyi', 'carta'] as sources,
  CASE 
    WHEN l.city IN ('San Francisco', 'New York') THEN 70
    ELSE 35
  END as samples
FROM roles r, locations l, stages s
WHERE r.title IN ('Data Scientist', 'Senior Data Scientist')
  AND NOT EXISTS (
    SELECT 1 FROM comp_data cd
    WHERE cd.role_id = r.id AND cd.location_id = l.id AND cd.stage_id = s.id
  );
