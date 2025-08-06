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
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <Alert className="border-amber-500/50 bg-amber-500/10 text-amber-300">
        <Database className="h-4 w-4" />
        <AlertDescription className="space-y-3">
          <div>
            <strong>Demo Mode:</strong> Supabase is not configured. 
            Set up your database to enable full functionality.
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="border-amber-500/50 text-amber-300 hover:bg-amber-500/20"
              onClick={() => window.open('/SUPABASE_SETUP.md', '_blank')}
            >
              <Info className="h-3 w-3 mr-1" />
              Setup Guide
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-amber-500/50 text-amber-300 hover:bg-amber-500/20"
              onClick={() => window.open('https://supabase.com', '_blank')}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Supabase
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}
