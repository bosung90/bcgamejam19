import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import { Provider } from 'react-redux'
import { store, dispatch } from 'store'
import Select from 'cf-select'
import { Home } from 'pages'

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Edit <code>src/App.js</code> and save to reload.
            </p>
            <button onClick={() => dispatch.count.increment()}>increment</button>
            <Home />
            <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
              {/* <Select selector={() => dispatch.count.getCount()} />
              {dispatch.count.getCount()} */}
              Learn React
            </a>
          </header>
        </div>
      </Provider>
    )
  }
}

export default App
