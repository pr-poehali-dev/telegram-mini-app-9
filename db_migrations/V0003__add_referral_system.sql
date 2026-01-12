-- Добавляем поля для реферальной системы в таблицу users
ALTER TABLE t_p49988359_telegram_mini_app_9.users 
ADD COLUMN IF NOT EXISTS referral_code VARCHAR(20) UNIQUE,
ADD COLUMN IF NOT EXISTS referred_by_id INTEGER REFERENCES t_p49988359_telegram_mini_app_9.users(id),
ADD COLUMN IF NOT EXISTS balance DECIMAL(12, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS referral_earnings DECIMAL(12, 2) DEFAULT 0;

-- Создаем индекс для быстрого поиска по реферальному коду
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON t_p49988359_telegram_mini_app_9.users(referral_code);

-- Создаем индекс для быстрого поиска рефералов пользователя
CREATE INDEX IF NOT EXISTS idx_users_referred_by_id ON t_p49988359_telegram_mini_app_9.users(referred_by_id);

-- Создаем таблицу для истории реферальных начислений
CREATE TABLE IF NOT EXISTS t_p49988359_telegram_mini_app_9.referral_earnings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES t_p49988359_telegram_mini_app_9.users(id),
    referral_id INTEGER NOT NULL REFERENCES t_p49988359_telegram_mini_app_9.users(id),
    amount DECIMAL(12, 2) NOT NULL,
    order_id INTEGER REFERENCES t_p49988359_telegram_mini_app_9.orders(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_referral_earnings_user_id ON t_p49988359_telegram_mini_app_9.referral_earnings(user_id);
CREATE INDEX IF NOT EXISTS idx_referral_earnings_referral_id ON t_p49988359_telegram_mini_app_9.referral_earnings(referral_id);