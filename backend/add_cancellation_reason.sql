-- Add cancellation_reason column to appointments table

ALTER TABLE appointments 
ADD COLUMN IF NOT EXISTS cancellation_reason TEXT;

-- Update status values description
COMMENT ON COLUMN appointments.status IS 'pending, confirmed, cancelled, completed';
COMMENT ON COLUMN appointments.cancellation_reason IS 'Reason provided by doctor when rejecting/cancelling appointment';
