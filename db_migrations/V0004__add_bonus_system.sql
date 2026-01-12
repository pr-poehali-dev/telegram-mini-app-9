-- Добавляем таблицу для настроек бонусной программы
CREATE TABLE IF NOT EXISTS t_p49988359_telegram_mini_app_9.bonus_settings (
    id SERIAL PRIMARY KEY,
    bonus_type VARCHAR(50) NOT NULL,
    bonus_amount DECIMAL(12, 2) NOT NULL,
    bonus_percentage DECIMAL(5, 2),
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Добавляем стандартные бонусы
INSERT INTO t_p49988359_telegram_mini_app_9.bonus_settings (bonus_type, bonus_amount, bonus_percentage, description) VALUES
('referral_signup', 100, NULL, 'Бонус за регистрацию реферала'),
('referral_first_deposit', 500, NULL, 'Бонус за первый депозит реферала'),
('referral_commission', 0, 5.00, 'Комиссия от пополнений реферала (5%)');

-- Обновляем таблицу referral_earnings: добавляем тип бонуса
ALTER TABLE t_p49988359_telegram_mini_app_9.referral_earnings 
ADD COLUMN IF NOT EXISTS bonus_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS description TEXT;

-- Добавляем индекс для типа бонуса
CREATE INDEX IF NOT EXISTS idx_referral_earnings_bonus_type ON t_p49988359_telegram_mini_app_9.referral_earnings(bonus_type);

-- Добавляем поле для отслеживания первого депозита
ALTER TABLE t_p49988359_telegram_mini_app_9.users 
ADD COLUMN IF NOT EXISTS first_deposit_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS total_deposits DECIMAL(12, 2) DEFAULT 0;