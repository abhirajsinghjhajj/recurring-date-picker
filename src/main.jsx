import React from 'react';
import ReactDOM from 'react-dom/client';
import RecurringDatePicker from './App.jsx';
import './index.css';

// Error boundary component for better error handling
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Recurring Date Picker Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-content">
            <h2>Something went wrong</h2>
            <p>The Recurring Date Picker encountered an error. Please refresh the page and try again.</p>
            <button 
              onClick={() => this.setState({ hasError: false, error: null })}
              className="btn btn--primary"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Initialize the React application
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <RecurringDatePicker />
    </ErrorBoundary>
  </React.StrictMode>
);

// Add some helpful development logging
if (process.env.NODE_ENV === 'development') {
  console.log('🗓️ Recurring Date Picker initialized in development mode');
}
