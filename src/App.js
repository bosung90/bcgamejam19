import React, { useState, useRef } from 'react'
import logo from './logo.svg'
import './App.css'
import { Provider } from 'react-redux'
import { View } from 'components'
import { store, dispatch } from 'store'
import { auth, getUserDocument } from 'firebase/config'
import { Redirect } from 'react-router-dom'
import Routes from 'Routes'

const EMAIL_DOMAIN = '@vhamster.ca'

function App() {
  return (
    <Provider store={store}>
      <Routes />
    </Provider>
  )
}

export default App
