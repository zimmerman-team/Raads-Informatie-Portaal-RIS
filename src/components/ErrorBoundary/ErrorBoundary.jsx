/* base */
import React from 'react';
import styles from './ErrorBoundary.module.scss';

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true });
    // You can also log the error to an error reporting service
    console.log('component related issue', error, info);
    // logErrorToMyService(error, info);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className={styles.component}>
          Er is iets misgegaan.<br />
          Probeer dit onderdeel opnieuw te laden of begin in een nieuw tabblad / venster.
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
