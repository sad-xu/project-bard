import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux'
import store from './store'
import App from './App'
import ErrorBoundary from './components/ErrorBoundary'

// 异常收集
window.addEventListener(
  'error',
  (e: ErrorEvent) => {
    console.log('!!err:', e)
    if (e.error) {
      // uploadErr('event', e.error?.message, e.error?.stack)
    } else {
      // 资源加载失败
      // const target = e.target as HTMLElement
      // uploadErr('resource', target?.nodeName, target?.outerHTML)
    }
  },
  true
)

window.addEventListener('unhandledrejection', (e: PromiseRejectionEvent) => {
  if (e.reason && e.reason.message) {
    console.log('!!unhandledrejection:', e)
    // uploadErr('rejection', e.reason.message, e.reason.stack)
  }
})

const container = document.getElementById('root')!
const root = createRoot(container)

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <App />
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>
)
