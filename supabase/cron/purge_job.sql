-- ###########################################################
-- CRON JOB: 3-Day Rolling Purge
-- Purpose: Automates the permanent deletion of "soft-deleted" tasks
-- ###########################################################

-- 1. Create or Update the cleanup function
-- This function targets rows marked as 'deleted' that are older than 3 days
CREATE OR REPLACE FUNCTION purge_old_trash()
RETURNS void AS $$
BEGIN
  DELETE FROM todos
  WHERE status = 'deleted'
  AND deleted_at < NOW() - INTERVAL '3 days';
END;
$$ LANGUAGE plpgsql;

-- 2. Register the Job with pg_cron
-- This ensures the job is unique and runs every night at midnight (00:00)
DO $$
BEGIN
    -- Remove the job if it already exists to avoid duplicates
    PERFORM cron.unschedule('purge-trash-daily');
    
    -- Schedule the job: (Job Name, Cron Schedule, Command)
    PERFORM cron.schedule(
      'purge-trash-daily',
      '0 0 * * *',
      'SELECT purge_old_trash();'
    );
END $$;