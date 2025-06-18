"use client"

import type React from "react"
import { Component, type ReactNode } from "react"
import Button from "./Button"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Algo deu errado</h2>
            <p className="text-gray-600">Ocorreu um erro inesperado. Tente recarregar a página.</p>
            <Button onClick={() => window.location.reload()} variant="primary">
              Recarregar Página
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
