-- Add updated_at column and automatic trigger for reactions
ALTER TABLE reactions ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now();

CREATE TRIGGER trg_reactions_set_updated_at
    BEFORE UPDATE ON reactions
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();
