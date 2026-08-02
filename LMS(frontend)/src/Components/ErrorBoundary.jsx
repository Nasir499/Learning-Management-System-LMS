import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gray-900 text-white p-5 text-center">
                    <h1 className="text-4xl font-bold text-red-500 mb-4">Something went wrong</h1>
                    <p className="text-lg text-gray-300 mb-6 max-w-md">
                        An unexpected error occurred. Please try refreshing the page or navigating back to the home page.
                    </p>
                    <div className="flex gap-4">
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-yellow-600 hover:bg-yellow-500 text-white font-semibold py-2 px-6 rounded transition-all"
                        >
                            Reload Page
                        </button>
                        <a
                            href="/"
                            className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded transition-all"
                        >
                            Go to Home
                        </a>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
