import React from 'react';
import { isSupabaseConfigured } from '@/lib/supabase';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Database, ExternalLink, Info } from 'lucide-react';

export default function SupabaseStatus() {
  // Only show if Supabase is not configured (demo mode)
  if (isSupabaseConfigured) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md" data-supabase-status>
      <Alert className="border-blue-500/50 bg-blue-500/10 text-blue-300">
        <Info className="h-4 w-4" />
        <AlertDescription className="space-y-3">
          <div>
            <strong>Demo Mode:</strong> Full functionality with simulated data.
            All features are available for testing!
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
              Try Login
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}
