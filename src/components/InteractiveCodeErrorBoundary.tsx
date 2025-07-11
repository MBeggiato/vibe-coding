import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class InteractiveCodeErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('InteractiveCode Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="interactive-code-error">
          <div className="interactive-code-error__content">
            <h3>Code Display Error</h3>
            <p>Unable to render the interactive code component.</p>
            <details>
              <summary>Error Details</summary>
              <pre>{this.state.error?.message}</pre>
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
