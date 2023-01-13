import React, { Component, ErrorInfo, ReactNode } from 'react';
import styled from 'styled-components';
import { Button } from '../../../styled/Button';

const ErrorContainer = styled.div`
  flex: 1;
  flex-direction: column;
  display: flex;
  overflow: hidden;
  pointer-events: all;
  background: ${(p) => p.theme.LayerBackground};
  color: ${(p) => p.theme.Foreground};
  padding: 2em;
  border-radius: 6px;
  max-width: 500px;
`;

const ErrorHeader = styled.div`
  font-size: 1.5em;
  margin-bottom: 0.5em;
`;

const ErrorMessage = styled.div`
  margin-bottom: 0.5em;
  color: ${(p) => p.theme.SubForeground};
`;

const RetryButton = styled(Button)`
  margin-top: 0.5em;
  align-self: flex-end;
  min-width: 130px;
`;

interface Props {
  errorHeader: string;
  children?: ReactNode;
}

interface State {
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {};

  public static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    return this.state.error ? (
      <ErrorContainer>
        <ErrorHeader>Sorry, an error occurred...</ErrorHeader>
        <ErrorMessage>{this.state.error.message}</ErrorMessage>
        {this.props.errorHeader}
        <RetryButton onClick={() => this.setState({ error: undefined })}>Retry</RetryButton>
      </ErrorContainer>
    ) : (
      this.props.children
    );
  }
}
