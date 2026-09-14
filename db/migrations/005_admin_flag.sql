-- Add a flag to represent whether a user is an admin
ALTER TABLE users ADD COLUMN is_admin boolean NOT NULL DEFAULT FALSE;
