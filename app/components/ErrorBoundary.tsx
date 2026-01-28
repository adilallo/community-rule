"use client";

import React, { Component, type ReactNode } from "react";
import { logger } from "../../lib/logger";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error to an error reporting service
    logger.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI using design tokens
      return (
        <div className="min-h-[200px] flex items-center justify-center p-[var(--spacing-scale-016)]">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-[var(--color-content-default-primary)] mb-[var(--spacing-scale-008)]">
              Something went wrong
            </h2>
            <p className="text-[var(--color-content-default-secondary)] mb-[var(--spacing-scale-016)]">
              We&apos;re sorry, but something unexpected happened.
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-[var(--spacing-scale-016)] py-[var(--spacing-scale-008)] bg-[var(--color-surface-default-brand-royal)] text-[var(--color-content-inverse-primary)] rounded-[var(--radius-measures-radius-small)] hover:bg-[var(--color-surface-hover-brand-royal)] transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
