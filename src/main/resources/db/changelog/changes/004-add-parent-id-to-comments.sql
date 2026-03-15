--liquibase formatted sql

--changeset system:004-add-parent-id-to-comments
ALTER TABLE comment ADD COLUMN parent_id BIGINT;
ALTER TABLE comment ADD CONSTRAINT fk_comment_parent FOREIGN KEY (parent_id) REFERENCES comment(id) ON DELETE CASCADE;

CREATE INDEX idx_comment_parent_id ON comment (parent_id);
