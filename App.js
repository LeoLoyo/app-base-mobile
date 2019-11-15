import { useState, useEffect } from 'react'
import OTTBuilder from './src'
import bundleApp from './build/output.json'

function App() {
  const [isReadyApp, setReadyApp] = useState(false)
  const builderOTTApp = new OTTBuilder(bundleApp)
  const appMounted = builderOTTApp.mount()
  
  useEffect(() => {
    setReadyApp(true)
  }, [isReadyApp])

  return isReadyApp ? appMounted : null
}


export default App