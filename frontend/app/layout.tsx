import './globals.css'

export const metadata = {
  title: 'Todo App - Phase II',
  description: 'Full-stack todo application with authentication',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">{children}</body>
    </html>
  )
}