--liquibase formatted sql

--changeset system:003-create-comments-table
CREATE TABLE comment (
    id BIGSERIAL PRIMARY KEY,
    post_id BIGINT NOT NULL,
    author VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_comment_post FOREIGN KEY (post_id) REFERENCES post(id) ON DELETE CASCADE
);

CREATE INDEX idx_comment_post_id ON comment (post_id);
