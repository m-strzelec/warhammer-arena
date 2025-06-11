CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE UserType AS ENUM ('ADMIN', 'USER');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    type UserType NOT NULL DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE blacklisted_tokens (
    id SERIAL PRIMARY KEY,
    token TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (username, password, type) VALUES
('admin', '$2b$10$ZXH.9p8WKbC6BD5DvWzfe.cne0AXhI48UCpE3vtXjEJDMB8jzcOdm', 'ADMIN'),
('user1', '$2b$10$yuH5vQtG1uF8AhUxj0wf6.pFgYAF7rjRsc9PJ2MjEnjd4zyeZGhEm', 'USER'),
('user2', '$2b$10$qTKq/WDbLf0Gzs7uS9sz2eJIIiqrfy2oMYtEmXfgB8cD7QUSgoRO.', 'USER');
