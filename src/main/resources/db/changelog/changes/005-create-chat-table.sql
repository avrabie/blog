--liquibase formatted sql

--changeset system:005-create-chat-table
CREATE TABLE chat (
    id BIGSERIAL PRIMARY KEY,
    author VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_chat_created_at ON chat (created_at);