import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'QIP Payout Calculator',
  description: 'Dynamic Quality Improvement Program payout calculator',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans text-text bg-background min-h-screen">
        <header className="border-b border-secondary bg-white">
          <div className="container mx-auto px-6 py-4 flex items-center gap-6">
            <h1 className="text-lg font-medium text-text">DynamicQIP</h1>
            <nav className="flex items-center gap-4 text-sm">
              <a href="/" className="text-text hover:text-primary">Home</a>
              <a href="/QIP_Payout_Formula.html" className="text-text hover:text-primary">Formula</a>
              <a href="/about" className="text-text hover:text-primary">About</a>
            </nav>
          </div>
        </header>
        <main>
          {children}
        </main>
      </body>
    </html>
  )
}