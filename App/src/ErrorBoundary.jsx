import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || "Error inesperado" };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary capturo un error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "24px", fontFamily: "Segoe UI, sans-serif" }}>
          <h1>Ocurrio un error en la interfaz</h1>
          <p>{this.state.message}</p>
          <p>Recarga la pagina o revisa la consola del navegador para mas detalle.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;