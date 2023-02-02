import { Component } from "react";
 
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
 
  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return {
      hasError: true,
      error,
    };
  }
 
  componentDidCatch(error, errorInfo) {
    console.log("ERRORORORRO");
  }
 
  render() {
    const { hasError, error } = this.state;
 
    if (hasError) {
      // You can render any custom fallback UI
      return (
        <div>
          <p>Something went wrong 😭</p>
 
          {error.message && <span>Here's the error: {error.message}</span>}
        </div>
      );
    }
 
    return this.props.children;
  }
}
 
export default ErrorBoundary;