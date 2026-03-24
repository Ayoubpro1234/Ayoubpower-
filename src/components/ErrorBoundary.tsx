import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/Card';
import { Button } from './ui/Button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<any, any> {
  state = {
    hasError: false,
    error: null
  };

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
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
        }
      } catch (e) {
        // Not a JSON error
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#F0F0F0]" dir="rtl">
          <Card className="max-w-lg w-full p-12 text-center space-y-8">
            <div className="w-24 h-24 bg-red-500 text-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center mx-auto">
              <AlertTriangle size={48} />
            </div>
            <div>
              <CardTitle className="text-4xl">عذراً، حدث خطأ!</CardTitle>
              <CardDescription className="text-xl mt-4 font-bold opacity-70">
                {errorMessage}
              </CardDescription>
            </div>
            <Button 
              size="lg" 
              onClick={() => window.location.reload()} 
              className="w-full flex items-center justify-center gap-4 text-2xl py-6"
            >
              <RefreshCw size={24} />
              تحديث الصفحة
            </Button>
          </Card>
        </div>
      );
    }

    // @ts-ignore
    return this.props.children;
  }
}
