CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_name VARCHAR(255),
    user_email VARCHAR(255) NOT NULL,
    user_phone VARCHAR(50),
    amount DECIMAL(10,2) NOT NULL,
    yookassa_payment_id VARCHAR(100),
    status VARCHAR(20) DEFAULT 'pending',
    payment_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    paid_at TIMESTAMP
);

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    product_id VARCHAR(100),
    product_name VARCHAR(255),
    product_price DECIMAL(10,2),
    quantity INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_payment_id ON orders(yookassa_payment_id);
CREATE INDEX idx_orders_status ON orders(status);

CREATE TABLE telegram_auth_tokens (
    id SERIAL PRIMARY KEY,
    token_hash VARCHAR(64) UNIQUE NOT NULL,
    telegram_id VARCHAR(50) NOT NULL,
    telegram_username VARCHAR(255),
    telegram_first_name VARCHAR(255),
    telegram_last_name VARCHAR(255),
    telegram_photo_url TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    telegram_id VARCHAR(50) UNIQUE,
    email VARCHAR(255),
    name VARCHAR(255),
    avatar_url TEXT,
    email_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP
);

CREATE INDEX idx_users_telegram_id ON users(telegram_id);
CREATE INDEX idx_telegram_auth_tokens_hash ON telegram_auth_tokens(token_hash);
CREATE INDEX idx_telegram_auth_tokens_expires ON telegram_auth_tokens(expires_at);