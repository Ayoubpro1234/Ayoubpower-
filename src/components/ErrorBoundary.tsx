import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = {
    hasError: false,
    error: null
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    const { hasError, error } = this.state;
    if (hasError) {
      let errorMessage = "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.";
      
      try {
        if (error?.message) {
          const parsedError = JSON.parse(error.message);
          if (parsedError.error) {
            errorMessage = `خطأ في قاعدة البيانات: ${parsedError.error}`;
          }
        } else if (error?.toString()) {
          errorMessage = error.toString();
        }
      } catch (e) {
        if (error?.message) {
          errorMessage = error.message;
        }
      }

      return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', backgroundColor: '#F0F0F0', direction: 'rtl', fontFamily: 'system-ui, sans-serif' }}>
          <div style={{ maxWidth: '32rem', width: '100%', backgroundColor: 'white', padding: '3rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', textAlign: 'center' }}>
            <div style={{ width: '6rem', height: '6rem', backgroundColor: '#ef4444', color: 'white', border: '4px solid black', boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem auto' }}>
              <AlertTriangle size={48} />
            </div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: '900', marginBottom: '1rem', color: 'black' }}>عذراً، حدث خطأ!</h1>
            <p style={{ fontSize: '1.25rem', fontWeight: 'bold', opacity: 0.7, marginBottom: '2rem', color: 'black', wordBreak: 'break-word' }}>
              {errorMessage}
            </p>
            <button 
              onClick={() => window.location.reload()} 
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', fontSize: '1.5rem', padding: '1.5rem', backgroundColor: 'black', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
            >
              <RefreshCw size={24} />
              تحديث الصفحة
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
