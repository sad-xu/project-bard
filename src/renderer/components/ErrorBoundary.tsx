import React from 'react'
// import { uploadErr } from '../api/base'

class ErrorBoundary extends React.Component<{}, { hasError: boolean }> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errInfo: any) {
    // 本地是旧的
    if (error.message && error.message.indexOf('Loading chunk') !== -1) {
      window.location.reload()
    } else {
      console.log(error, errInfo)
      // uploadErr('boundary', error.message, errInfo.componentStack)
    }
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>
    }

    return this.props.children
  }
}

export default ErrorBoundary
