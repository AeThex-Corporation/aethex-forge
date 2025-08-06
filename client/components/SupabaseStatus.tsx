import React from 'react';
import { isSupabaseConfigured } from '@/lib/supabase';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Database, ExternalLink, Info } from 'lucide-react';

export default function SupabaseStatus() {
  if (isSupabaseConfigured) {
    return null; // Don't show anything if Supabase is properly configured
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md" data-supabase-status>
      <Alert className="border-blue-500/50 bg-blue-500/10 text-blue-300">
        <Info className="h-4 w-4" />
        <AlertDescription className="space-y-3">
          <div>
            <strong>Connected:</strong> Supabase is configured! To enable GitHub/Google login,
            configure OAuth providers in your Supabase dashboard.
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="border-blue-500/50 text-blue-300 hover:bg-blue-500/20"
              onClick={() => {
                // Hide the status notification
                const notification = document.querySelector('[data-supabase-status]');
                if (notification) {
                  notification.style.display = 'none';
                }
              }}
            >
              <Info className="h-3 w-3 mr-1" />
              Got it!
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-blue-500/50 text-blue-300 hover:bg-blue-500/20"
              onClick={() => window.open('/login', '_self')}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Try Demo
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}
