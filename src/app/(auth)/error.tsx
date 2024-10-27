'use client';

import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function error() {
   return (
      <div className="flex h-screen flex-col items-center justify-center gap-y-4">
         <AlertTriangle className="size-6 text-muted-foreground" />
         <p className="text-sm text-muted-foreground">Something went wrong</p>
         <Button variant="secondary" size="sm">
            <Link href="/">Back to home</Link>
         </Button>
      </div>
   );
}
