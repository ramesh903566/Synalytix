import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in component:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="flex flex-col items-center justify-center p-6 bg-bg-canvas border border-red-500/20 rounded-2xl h-full w-full min-h-[200px]">
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
          <h3 className="text-text-primary font-semibold mb-2">Failed to load component</h3>
          <p className="text-sm text-text-secondary text-center max-w-sm">
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
          <button 
            onClick={() => this.setState({ hasError: false })}
            className="mt-4 px-4 py-2 bg-bg-elevated hover:bg-bg-sunken text-text-secondary text-sm font-medium rounded-lg transition-colors border border-border"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
