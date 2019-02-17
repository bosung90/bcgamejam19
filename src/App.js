import React from 'react'
import { Provider } from 'react-redux'
import { FirebaseSync } from 'components'
import { store } from 'store'
import Routes from 'Routes'

function App() {
  return (
    <Provider store={store}>
      <>
        <FirebaseSync />
        <Routes />
      </>
    </Provider>
  )
}

export default App
