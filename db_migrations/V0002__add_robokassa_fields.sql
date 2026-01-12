ALTER TABLE orders ADD COLUMN IF NOT EXISTS robokassa_inv_id INTEGER UNIQUE;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_address TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_comment TEXT;

CREATE INDEX IF NOT EXISTS idx_orders_robokassa_inv_id ON orders(robokassa_inv_id);