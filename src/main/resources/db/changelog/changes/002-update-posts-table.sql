--liquibase formatted sql

--changeset system:002-update-posts-table
ALTER TABLE post RENAME COLUMN start_date TO created_at;
ALTER TABLE post ADD COLUMN subtitle VARCHAR(255);
ALTER TABLE post ADD COLUMN tags TEXT[];
