-- Add avatar url to users
ALTER TABLE users ADD COLUMN avatar_url text;

-- Posts
CREATE TABLE posts (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    content text NOT NULL,

    author_id integer,

    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT fk_posts_authors
        FOREIGN KEY (author_id)
        REFERENCES users (id)
        ON DELETE SET NULL
);

CREATE INDEX idx_posts_content ON posts (content);
CREATE INDEX idx_posts_author_id ON posts (author_id);

CREATE TRIGGER trg_posts_set_updated_at
    BEFORE UPDATE ON posts
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

-- Likes
CREATE TABLE reactions (
    post_id integer NOT NULL,
    user_id integer NOT NULL,

    vote smallint NOT NULL CHECK (vote IN (1, -1)),

    created_at timestamptz NOT NULL DEFAULT now(),

    PRIMARY KEY (post_id, user_id),

    CONSTRAINT fk_reactions_posts
        FOREIGN KEY (post_id)
        REFERENCES posts (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_reactions_users
        FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE
);
