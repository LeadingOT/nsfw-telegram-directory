-- Schema V2: Add P90 percentiles, total cash, and example titles

-- 1. Add P90 columns to comp_data
ALTER TABLE comp_data ADD COLUMN IF NOT EXISTS base_salary_p90 INT;
ALTER TABLE comp_data ADD COLUMN IF NOT EXISTS equity_pct_p90 DECIMAL(5,3);

-- 2. Add bonus columns (for total cash calculation)
ALTER TABLE comp_data ADD COLUMN IF NOT EXISTS bonus_p25 INT;
ALTER TABLE comp_data ADD COLUMN IF NOT EXISTS bonus_p50 INT;
ALTER TABLE comp_data ADD COLUMN IF NOT EXISTS bonus_p75 INT;
ALTER TABLE comp_data ADD COLUMN IF NOT EXISTS bonus_p90 INT;

-- 3. Add example_titles array to roles table
ALTER TABLE roles ADD COLUMN IF NOT EXISTS example_titles TEXT[];
ALTER TABLE roles ADD COLUMN IF NOT EXISTS description TEXT;

-- 4. Update existing roles with example titles
UPDATE roles SET 
  example_titles = ARRAY['Software Engineer', 'Engineer', 'Backend Engineer', 'Frontend Engineer'],
  description = 'Individual contributor, mid-level software development'
WHERE title = 'Software Engineer';

UPDATE roles SET 
  example_titles = ARRAY['Senior Software Engineer', 'Senior Engineer', 'Sr. Engineer', 'Lead Engineer'],
  description = 'Senior individual contributor, technical leadership'
WHERE title = 'Senior Software Engineer';

UPDATE roles SET 
  example_titles = ARRAY['Staff Software Engineer', 'Staff Engineer', 'Principal Engineer I'],
  description = 'Senior IC with cross-team impact'
WHERE title = 'Staff Software Engineer';

UPDATE roles SET 
  example_titles = ARRAY['Principal Software Engineer', 'Principal Engineer', 'Distinguished Engineer'],
  description = 'Very senior IC with org-wide impact'
WHERE title = 'Principal Software Engineer';

UPDATE roles SET 
  example_titles = ARRAY['Engineering Manager', 'Manager, Engineering', 'Software Engineering Manager'],
  description = 'First-level engineering management'
WHERE title = 'Engineering Manager';

UPDATE roles SET 
  example_titles = ARRAY['Senior Engineering Manager', 'Senior Manager, Engineering', 'Manager, Software Engineering'],
  description = 'Senior manager, multiple teams'
WHERE title = 'Senior Engineering Manager';

UPDATE roles SET 
  example_titles = ARRAY['Product Manager', 'PM', 'Associate Product Manager'],
  description = 'Product strategy and execution'
WHERE title = 'Product Manager';

UPDATE roles SET 
  example_titles = ARRAY['Senior Product Manager', 'Senior PM', 'Lead Product Manager'],
  description = 'Senior product leadership'
WHERE title = 'Senior Product Manager';

UPDATE roles SET 
  example_titles = ARRAY['Data Scientist', 'ML Engineer', 'Machine Learning Engineer'],
  description = 'Data analysis and ML modeling'
WHERE title = 'Data Scientist';

UPDATE roles SET 
  example_titles = ARRAY['Senior Data Scientist', 'Senior ML Engineer', 'Staff Data Scientist'],
  description = 'Senior data science and ML'
WHERE title = 'Senior Data Scientist';

-- 5. Update existing comp_data with P90 and bonus data
UPDATE comp_data SET 
  base_salary_p90 = ROUND(base_salary_p75 * 1.20),
  equity_pct_p90 = equity_pct_p75 * 1.50,
  bonus_p25 = ROUND(base_salary_p25 * 0.10),
  bonus_p50 = ROUND(base_salary_p50 * 0.15),
  bonus_p75 = ROUND(base_salary_p75 * 0.20),
  bonus_p90 = ROUND(base_salary_p75 * 1.20 * 0.25)
WHERE base_salary_p90 IS NULL;

-- 6. Create title_mapping table for fuzzy matching
CREATE TABLE IF NOT EXISTS title_mapping (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  input_title TEXT NOT NULL,
  canonical_role_id UUID REFERENCES roles(id),
  confidence DECIMAL(3,2) DEFAULT 1.0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_title_mapping_input ON title_mapping(input_title);

-- 7. Insert common title variations
INSERT INTO title_mapping (input_title, canonical_role_id, confidence)
SELECT 'Software Developer', id, 0.95 FROM roles WHERE title = 'Software Engineer';

INSERT INTO title_mapping (input_title, canonical_role_id, confidence)
SELECT 'Full Stack Engineer', id, 0.95 FROM roles WHERE title = 'Software Engineer';

INSERT INTO title_mapping (input_title, canonical_role_id, confidence)
SELECT 'Backend Developer', id, 0.90 FROM roles WHERE title = 'Software Engineer';

INSERT INTO title_mapping (input_title, canonical_role_id, confidence)
SELECT 'Frontend Developer', id, 0.90 FROM roles WHERE title = 'Software Engineer';

INSERT INTO title_mapping (input_title, canonical_role_id, confidence)
SELECT 'Senior Developer', id, 0.95 FROM roles WHERE title = 'Senior Software Engineer';

INSERT INTO title_mapping (input_title, canonical_role_id, confidence)
SELECT 'Lead Engineer', id, 0.90 FROM roles WHERE title = 'Senior Software Engineer';

INSERT INTO title_mapping (input_title, canonical_role_id, confidence)
SELECT 'Tech Lead', id, 0.85 FROM roles WHERE title = 'Senior Software Engineer';

INSERT INTO title_mapping (input_title, canonical_role_id, confidence)
SELECT 'Staff Engineer', id, 1.0 FROM roles WHERE title = 'Staff Software Engineer';

INSERT INTO title_mapping (input_title, canonical_role_id, confidence)
SELECT 'Principal', id, 0.90 FROM roles WHERE title = 'Principal Software Engineer';

INSERT INTO title_mapping (input_title, canonical_role_id, confidence)
SELECT 'EM', id, 0.95 FROM roles WHERE title = 'Engineering Manager';

INSERT INTO title_mapping (input_title, canonical_role_id, confidence)
SELECT 'PM', id, 0.95 FROM roles WHERE title = 'Product Manager';

INSERT INTO title_mapping (input_title, canonical_role_id, confidence)
SELECT 'Data Analyst', id, 0.80 FROM roles WHERE title = 'Data Scientist';

INSERT INTO title_mapping (input_title, canonical_role_id, confidence)
SELECT 'ML Engineer', id, 0.95 FROM roles WHERE title = 'Data Scientist';

-- 8. Create function for title matching
CREATE OR REPLACE FUNCTION match_title(input_text TEXT)
RETURNS TABLE (
  role_id UUID,
  role_title TEXT,
  confidence DECIMAL,
  example_titles TEXT[]
) AS $$
BEGIN
  RETURN QUERY
  -- First try exact match with title_mapping
  SELECT r.id, r.title, tm.confidence, r.example_titles
  FROM title_mapping tm
  JOIN roles r ON tm.canonical_role_id = r.id
  WHERE LOWER(tm.input_title) = LOWER(input_text)
  UNION ALL
  -- Then try fuzzy match with example_titles
  SELECT r.id, r.title, 0.90::DECIMAL as confidence, r.example_titles
  FROM roles r
  WHERE input_text ILIKE ANY(r.example_titles)
  UNION ALL
  -- Finally try partial match with role title
  SELECT r.id, r.title, 0.75::DECIMAL as confidence, r.example_titles
  FROM roles r
  WHERE LOWER(r.title) LIKE '%' || LOWER(input_text) || '%'
  ORDER BY confidence DESC
  LIMIT 5;
END;
$$ LANGUAGE plpgsql;
