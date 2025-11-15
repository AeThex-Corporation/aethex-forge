-- Add Stripe payment fields to nexus_contracts
ALTER TABLE public.nexus_contracts ADD COLUMN IF NOT EXISTS stripe_payment_intent_id text;

-- Add index for quick lookup
CREATE INDEX IF NOT EXISTS nexus_contracts_stripe_payment_intent_idx ON public.nexus_contracts (stripe_payment_intent_id);

-- Add Stripe charge fields to nexus_payments
ALTER TABLE public.nexus_payments ADD COLUMN IF NOT EXISTS stripe_charge_id text;

-- Add index for quick lookup
CREATE INDEX IF NOT EXISTS nexus_payments_stripe_charge_idx ON public.nexus_payments (stripe_charge_id);

-- Add Stripe Connect fields to nexus_creator_profiles
ALTER TABLE public.nexus_creator_profiles ADD COLUMN IF NOT EXISTS stripe_connect_account_id text;
ALTER TABLE public.nexus_creator_profiles ADD COLUMN IF NOT EXISTS stripe_account_verified boolean default false;

-- Add indexes
CREATE INDEX IF NOT EXISTS nexus_creator_profiles_stripe_account_idx ON public.nexus_creator_profiles (stripe_connect_account_id);

-- Add comments
COMMENT ON COLUMN public.nexus_contracts.stripe_payment_intent_id IS 'Stripe PaymentIntent ID for tracking contract payments';
COMMENT ON COLUMN public.nexus_payments.stripe_charge_id IS 'Stripe Charge ID for refund tracking';
COMMENT ON COLUMN public.nexus_creator_profiles.stripe_connect_account_id IS 'Stripe Connect Express account ID for creator payouts';
COMMENT ON COLUMN public.nexus_creator_profiles.stripe_account_verified IS 'Whether Stripe Connect account is verified and ready for payouts';
