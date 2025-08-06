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
              className="border-amber-500/50 text-amber-300 hover:bg-amber-500/20"
              onClick={() => {
                const setupContent = `# Quick Supabase Setup for AeThex

## 1. Get Your Credentials
1. Go to your Supabase dashboard: https://app.supabase.com/projects/etzlqcghfdrkdqqfvzac
2. Go to Settings > API
3. Copy your Project URL and anon key

## 2. Update Environment Variables
Use the DevServerControl or set these values:

VITE_SUPABASE_URL=https://etzlqcghfdrkdqqfvzac.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

## 3. Run Database Migration
Go to Database > SQL Editor in Supabase and run the migration from the full setup guide.

## 4. Restart Dev Server
After setting variables, restart your development server.`;

                navigator.clipboard.writeText(setupContent).then(() => {
                  alert('Setup instructions copied to clipboard!');
                }).catch(() => {
                  const newWindow = window.open('', '_blank');
                  if (newWindow) {
                    newWindow.document.write('<pre>' + setupContent + '</pre>');
                  }
                });
              }}
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
