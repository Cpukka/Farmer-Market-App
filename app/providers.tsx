// app/providers.tsx
'use client'

import { ThemeProvider } from 'next-themes'
import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'
import { CartProvider } from './contexts/CartContext'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <CartProvider>
          {children}
        </CartProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}