import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LoadingScreen from '@/components/LoadingScreen';
import { useToast } from '@/hooks/use-toast';

export default function DiscordOAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');

        if (error) {
          throw new Error(`Discord OAuth error: ${error}`);
        }

        if (!code) {
          throw new Error('No authorization code received from Discord');
        }

        // Send code to backend to exchange for token
        const response = await fetch('/api/discord/oauth/callback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, state }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to process Discord OAuth');
        }

        const data = await response.json();

        // Store the Discord token if provided
        if (data.access_token) {
          localStorage.setItem('discord_access_token', data.access_token);
        }

        toast({
          title: 'Discord connected',
          description: 'Welcome to AeThex!',
        });

        // Redirect to dashboard or home
        navigate('/dashboard', { replace: true });
      } catch (error) {
        console.error('Discord OAuth callback error:', error);
        toast({
          variant: 'destructive',
          title: 'Authentication failed',
          description: error instanceof Error ? error.message : 'Failed to connect Discord',
        });
        // Redirect back to login
        setTimeout(() => navigate('/login', { replace: true }), 2000);
      } finally {
        setIsProcessing(false);
      }
    };

    handleCallback();
  }, [searchParams, navigate, toast]);

  if (isProcessing) {
    return (
      <LoadingScreen
        message="Connecting with Discord..."
        showProgress
        duration={1000}
      />
    );
  }

  return null;
}
