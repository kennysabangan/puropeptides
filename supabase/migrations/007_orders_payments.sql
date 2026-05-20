-- NowPayments crypto checkout: payment state on orders.

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS nowpayments_invoice_id TEXT,
  ADD COLUMN IF NOT EXISTS nowpayments_payment_id TEXT,
  ADD COLUMN IF NOT EXISTS payment_status TEXT NOT NULL DEFAULT 'waiting',
  ADD COLUMN IF NOT EXISTS pay_currency TEXT,
  ADD COLUMN IF NOT EXISTS pay_amount NUMERIC(20, 8),
  ADD COLUMN IF NOT EXISTS pay_address TEXT;

-- NowPayments statuses we care about:
--   waiting, confirming, confirmed, sending, partially_paid, finished,
--   failed, refunded, expired
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_payment_status_check;
ALTER TABLE orders
  ADD CONSTRAINT orders_payment_status_check
  CHECK (payment_status IN (
    'waiting','confirming','confirmed','sending','partially_paid',
    'finished','failed','refunded','expired'
  ));

CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_nowpayments_invoice
  ON orders(nowpayments_invoice_id)
  WHERE nowpayments_invoice_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_orders_payment_status
  ON orders(payment_status);
