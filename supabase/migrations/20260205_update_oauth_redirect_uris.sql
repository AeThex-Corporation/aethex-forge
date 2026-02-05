-- Update OAuth client redirect URIs to include localhost:8080 for local dev
-- This enables Foundation login to work in both production and development

UPDATE public.oauth_clients 
SET redirect_uris = '["https://aethex.dev/auth/callback", "http://localhost:8080/auth/callback", "http://localhost:3000/auth/callback", "http://localhost:5173/auth/callback"]'::jsonb,
    updated_at = NOW()
WHERE client_id = 'aethex_corp';
