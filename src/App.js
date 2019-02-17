import React from 'react'
import { Provider } from 'react-redux'
import { useFirebaseSync } from 'hooks'
import { store } from 'store'
import Routes from 'Routes'

function App() {
  useFirebaseSync()
  return (
    <Provider store={store}>
      <Routes />
    </Provider>
  )
}

export default App
