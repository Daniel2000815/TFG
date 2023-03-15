class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }
  
    static getDerivedStateFromError(error) {
      // Update state so the next render will show the fallback UI.
      return { hasError: true };
    }
  
    componentDidCatch(error, errorInfo) {
        console.log("ERRORS");
      // You can also log the error to an error reporting service
      logErrorToMyService(error, errorInfo);
    }
  
    render() {
      if (this.state.hasError) {
        // You can render any custom fallback UI
        return <h1>Something went wrong.</h1>;
      }
  
      return <ShadertoyReact
      fs={props.sdf ? fs(props.sdf, primitivesCode) : defaultShader()}
      key={props.sdf+primitivesCode}
      uniforms={{
        ...props.uniforms,
        u_zoom: { type: '1f', value: zoom },
        u_specular: { type: '3fv', value: [1.0, 0.0, 1.0] },
        u_diffuse: { type: '3fv', value: [1.0, 0.0, 0.0] },
        u_ambient: { type: '3fv', value: [0.2, 0.2, 0.2] },
        u_smoothness: { type: '1f', value: 10.0 },
      }}
    />

    }
  }