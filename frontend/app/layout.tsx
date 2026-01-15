import './globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'Todo App - Phase II',
  description: 'Full-stack todo application with authentication',
}

interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
