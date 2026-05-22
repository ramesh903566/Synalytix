import type { Metadata } from 'next'
import '@/app/globals.css'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'
import { QueryProvider } from '@/lib/providers/QueryProvider'

export const metadata: Metadata = {
  title: { default: 'Synalytix', template: '%s — Synalytix' },
  description: 'AI-powered analytics and automation platform',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="light">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Anton&family=Arimo:wght@400;600&family=Bebas+Neue&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body className="font-label-sm text-on-surface antialiased">
        <QueryProvider>
          <TooltipProvider>
            {children}
            <Toaster position="bottom-right" />
          </TooltipProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
