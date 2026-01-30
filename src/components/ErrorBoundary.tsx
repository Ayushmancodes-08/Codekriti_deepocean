import React, { Component, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from './ui/button';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: React.ErrorInfo | null;
}

/**
 * Global Error Boundary Component
 * Catches React errors and displays user-friendly error UI
 * Requirements: Task 21 - Error handling and recovery
 */
export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // Log error to console for debugging
        console.error('ErrorBoundary caught an error:', error, errorInfo);

        this.setState({
            error,
            errorInfo,
        });
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    handleReload = () => {
        window.location.reload();
    };

    handleGoHome = () => {
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-6">
                    <motion.div
                        className="w-full max-w-2xl"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Error Icon */}
                        <motion.div
                            className="flex justify-center mb-8"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
                        >
                            <div className="relative">
                                <motion.div
                                    className="absolute inset-0 bg-orange-500 rounded-full blur-xl opacity-50"
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        opacity: [0.5, 0.3, 0.5],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: 'easeInOut',
                                    }}
                                />
                                <div className="relative bg-gradient-to-r from-orange-500 to-red-600 rounded-full p-6 shadow-2xl">
                                    <AlertTriangle className="w-16 h-16 text-white" strokeWidth={2.5} />
                                </div>
                            </div>
                        </motion.div>

                        {/* Error Message */}
                        <motion.div
                            className="text-center mb-8"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                                Oops! Something went wrong
                            </h1>
                            <p className="text-lg text-white/70">
                                We're sorry for the inconvenience. Please try again.
                            </p>
                        </motion.div>

                        {/* Error Details Card */}
                        <motion.div
                            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-6"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <h3 className="text-lg font-semibold text-white mb-3">What happened?</h3>
                            <div className="bg-white/5 rounded-lg p-4 border-l-4 border-orange-500">
                                <p className="text-sm text-white/80 font-mono">
                                    {this.state.error?.message || 'An unexpected error occurred'}
                                </p>
                            </div>

                            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                                <details className="mt-4">
                                    <summary className="text-sm text-white/60 cursor-pointer hover:text-white/80 transition-colors">
                                        View technical details
                                    </summary>
                                    <div className="mt-2 bg-black/30 rounded-lg p-4 max-h-60 overflow-auto">
                                        <pre className="text-xs text-white/70 font-mono whitespace-pre-wrap">
                                            {this.state.errorInfo.componentStack}
                                        </pre>
                                    </div>
                                </details>
                            )}
                        </motion.div>

                        {/* Recovery Suggestions */}
                        <motion.div
                            className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-6 mb-8"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <p className="text-blue-400 font-semibold mb-3 flex items-center gap-2">
                                <span>💡</span>
                                What you can do:
                            </p>
                            <ul className="space-y-2 text-sm text-white/80">
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-400 mt-0.5">•</span>
                                    <span>Try refreshing the page</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-400 mt-0.5">•</span>
                                    <span>Check your internet connection</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-400 mt-0.5">•</span>
                                    <span>Clear your browser cache and cookies</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-400 mt-0.5">•</span>
                                    <span>Contact support if the problem persists</span>
                                </li>
                            </ul>
                        </motion.div>

                        {/* Action Buttons */}
                        <motion.div
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <Button
                                onClick={this.handleReset}
                                className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center gap-2 min-h-11 touch-manipulation focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <RefreshCw className="w-5 h-5" />
                                Try Again
                            </Button>
                            <Button
                                onClick={this.handleReload}
                                variant="outline"
                                className="border-2 border-white/20 text-white hover:bg-white/10 font-semibold py-3 px-6 rounded-lg transition-all duration-200 min-h-11 touch-manipulation focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                            >
                                Reload Page
                            </Button>
                            <Button
                                onClick={this.handleGoHome}
                                variant="outline"
                                className="border-2 border-white/20 text-white hover:bg-white/10 font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center gap-2 min-h-11 touch-manipulation focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                            >
                                <Home className="w-5 h-5" />
                                Go Home
                            </Button>
                        </motion.div>
                    </motion.div>
                </div>
            );
        }

        return this.props.children;
    }
}
