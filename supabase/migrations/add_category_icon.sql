-- Add icon column to categories table
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS icon TEXT DEFAULT 'folder';

-- Update existing categories with smart icons if they don't have one
UPDATE categories SET icon = 'user' WHERE name = 'PERSONAL' AND (icon IS NULL OR icon = 'folder');
UPDATE categories SET icon = 'briefcase' WHERE name = 'WORK' AND (icon IS NULL OR icon = 'folder');
UPDATE categories SET icon = 'shopping-cart' WHERE name = 'SHOPPING' AND (icon IS NULL OR icon = 'folder');
UPDATE categories SET icon = 'heart' WHERE name = 'HEALTH' AND (icon IS NULL OR icon = 'folder');
UPDATE categories SET icon = 'dollar-sign' WHERE name = 'FINANCE' AND (icon IS NULL OR icon = 'folder');
UPDATE categories SET icon = 'flame' WHERE name = 'URGENT' AND (icon IS NULL OR icon = 'folder');
