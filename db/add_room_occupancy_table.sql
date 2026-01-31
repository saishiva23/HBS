-- Add this to the database schema for complete room occupancy tracking

-- ==============================================
-- TABLE: ROOM_OCCUPANCY
-- Date-based room occupancy tracking
-- ==============================================
CREATE TABLE room_occupancy (
    -- Primary Key
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    
    -- Foreign Keys
    room_id BIGINT NOT NULL,
    booking_id BIGINT NOT NULL,
    
    -- Occupancy Period
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    
    -- Status
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    
    -- Constraints
    CONSTRAINT room_occupancy_status_chk CHECK (status IN ('ACTIVE', 'COMPLETED', 'CANCELLED')),
    CONSTRAINT room_occupancy_dates_chk CHECK (check_out_date > check_in_date),
    
    -- Indexes
    INDEX idx_room_dates (room_id, check_in_date, check_out_date),
    INDEX idx_booking (booking_id),
    INDEX idx_status_dates (status, check_in_date, check_out_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add comment
ALTER TABLE room_occupancy COMMENT = 'Tracks room occupancy by date ranges for accurate availability checking';