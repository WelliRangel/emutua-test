import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ProductProvider } from "./context/ProductContext"
import { Toaster } from "react-hot-toast"
import SmoothScrolling from "./components/atoms/SmoothScrolling"
import ErrorBoundary from "./components/atoms/ErrorBoundary"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Product CMS - Gerenciador de Produtos",
  description: "Sistema moderno de gerenciamento de produtos com CRUD completo",
  keywords: ["produtos", "cms", "gerenciamento", "e-commerce"],
  authors: [{ name: "Welli Rangel" }],
  viewport: "width=device-width, initial-scale=1",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className={inter.className}>
        <ErrorBoundary>
          <SmoothScrolling>
            <ProductProvider>
              {children}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: "#363636",
                    color: "#fff",
                  },
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: "#10B981",
                      secondary: "#fff",
                    },
                  },
                  error: {
                    duration: 4000,
                    iconTheme: {
                      primary: "#EF4444",
                      secondary: "#fff",
                    },
                  },
                }}
              />
            </ProductProvider>
          </SmoothScrolling>
        </ErrorBoundary>
      </body>
    </html>
  )
}
