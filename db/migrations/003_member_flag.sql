-- Add a flag to represent whether a user is a member
ALTER TABLE users ADD COLUMN is_member boolean NOT NULL DEFAULT FALSE;
