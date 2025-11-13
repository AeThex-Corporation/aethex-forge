-- Create fourthwall_products table
CREATE TABLE IF NOT EXISTS fourthwall_products (
  id BIGSERIAL PRIMARY KEY,
  fourthwall_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  image_url TEXT,
  category TEXT,
  synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create fourthwall_orders table
CREATE TABLE IF NOT EXISTS fourthwall_orders (
  id BIGSERIAL PRIMARY KEY,
  fourthwall_order_id TEXT UNIQUE NOT NULL,
  customer_email TEXT NOT NULL,
  items JSONB DEFAULT '[]'::jsonb,
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create fourthwall_webhook_logs table
CREATE TABLE IF NOT EXISTS fourthwall_webhook_logs (
  id BIGSERIAL PRIMARY KEY,
  event_type TEXT NOT NULL,
  payload JSONB,
  received_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_fourthwall_products_fourthwall_id ON fourthwall_products(fourthwall_id);
CREATE INDEX IF NOT EXISTS idx_fourthwall_products_category ON fourthwall_products(category);
CREATE INDEX IF NOT EXISTS idx_fourthwall_orders_fourthwall_order_id ON fourthwall_orders(fourthwall_order_id);
CREATE INDEX IF NOT EXISTS idx_fourthwall_orders_customer_email ON fourthwall_orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_fourthwall_orders_status ON fourthwall_orders(status);
CREATE INDEX IF NOT EXISTS idx_fourthwall_webhook_logs_event_type ON fourthwall_webhook_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_fourthwall_webhook_logs_received_at ON fourthwall_webhook_logs(received_at);

-- Enable RLS (Row Level Security)
ALTER TABLE fourthwall_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE fourthwall_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE fourthwall_webhook_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies - allow authenticated users to read, admins to manage
CREATE POLICY "Allow authenticated users to read fourthwall products"
  ON fourthwall_products
  FOR SELECT
  USING (true);

CREATE POLICY "Allow service role to manage fourthwall products"
  ON fourthwall_products
  FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Allow service role to manage fourthwall orders"
  ON fourthwall_orders
  FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Allow service role to manage webhook logs"
  ON fourthwall_webhook_logs
  FOR ALL
  USING (auth.role() = 'service_role');
