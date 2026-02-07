-- Add status column to rooms table
-- This column tracks the current status of each room

USE hotel_booking_db;

-- Check if column exists and add it
SET @dbname = 'hotel_booking_db';
SET @tablename = 'rooms';
SET @columnname = 'status';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  'SELECT ''Column already exists'' AS message;',
  'ALTER TABLE rooms ADD COLUMN status VARCHAR(20) DEFAULT ''AVAILABLE'' COMMENT ''Room status: AVAILABLE, OCCUPIED, MAINTENANCE, RESERVED'';'
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Update existing rooms to AVAILABLE status
UPDATE rooms 
SET status = 'AVAILABLE' 
WHERE status IS NULL OR status = '';

SELECT 'Room status column migration completed!' AS message;
