import React, { useState, useRef } from 'react'
import logo from 'logo.svg'
import 'App.css'
import { View } from 'components'
import { auth, getUserDocument } from 'firebase/config'
import { Redirect } from 'react-router-dom'

const EMAIL_DOMAIN = '@vamster.ca'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [verifyingUsername, setVerifyingUsername] = useState(false)
  const [usernameExistConfirmed, setUsernameExistConfirmed] = useState(false)
  const [usernameDontExistConfirmed, setUsernameDontExistConfirmed] = useState(false)
  const [loggingIn, setIsLoggingIn] = useState(false)

  const usernameInput = useRef()
  const passInput = useRef()
  const nameInput = useRef()
  return (
    <View fill>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>Username</p>
          <input
            autoFocus
            ref={usernameInput}
            disabled={usernameExistConfirmed || usernameDontExistConfirmed || verifyingUsername || loggingIn}
            value={username}
            onChange={e => setUsername(e.target.value.trim())}
          />
          {(usernameExistConfirmed || usernameDontExistConfirmed) && (
            <>
              <p>Password</p>
              <input
                ref={passInput}
                disabled={loggingIn}
                value={password}
                type="password"
                onChange={e => setPassword(e.target.value)}
              />
            </>
          )}
          {usernameDontExistConfirmed && (
            <>
              <p>Name</p>
              <input ref={nameInput} value={name} onChange={e => setName(e.target.value)} />
            </>
          )}

          {!usernameExistConfirmed && !usernameDontExistConfirmed && (
            <button
              onClick={() => {
                if (!username) {
                  alert('username cannot be empty')
                  return
                }
                setVerifyingUsername(true)
                auth
                  .fetchSignInMethodsForEmail(username + EMAIL_DOMAIN)
                  .then(res => {
                    if (res.includes('password')) {
                      setUsernameExistConfirmed(true)
                      setUsernameDontExistConfirmed(false)
                    } else {
                      setUsernameExistConfirmed(false)
                      setUsernameDontExistConfirmed(true)
                    }
                  })
                  .catch(e => {
                    alert(e.message)
                  })
                  .finally(() => {
                    setVerifyingUsername(false)
                    passInput.current && passInput.current.focus()
                  })
              }}
              disabled={verifyingUsername}
            >
              {verifyingUsername ? 'Checking...' : 'Next'}
            </button>
          )}
          {usernameExistConfirmed && (
            <button
              disabled={loggingIn}
              onClick={() => {
                setIsLoggingIn(true)
                auth
                  .signInWithEmailAndPassword(username + EMAIL_DOMAIN, password)
                  .then(res => {
                    alert('successfully logged in')
                  })
                  .catch(e => {
                    alert(e.message)
                  })
                  .finally(() => {
                    setIsLoggingIn(false)
                  })
              }}
            >
              {loggingIn ? 'Logging In...' : 'Login'}
            </button>
          )}
          {usernameDontExistConfirmed && (
            <>
              <button
                disabled={loggingIn}
                onClick={() => {
                  if (!name.trim()) {
                    alert('name cannot be empty')
                    return
                  }
                  setIsLoggingIn(true)
                  auth
                    .createUserWithEmailAndPassword(username + EMAIL_DOMAIN, password)
                    .then(res => {
                      const uid = res.user.uid
                      getUserDocument(uid).set({
                        userName: username,
                        name: name,
                        id: uid,
                        joinedClasses: {},
                      })
                      alert('successfully created ' + username)
                    })
                    .catch(e => {
                      alert(e.message)
                    })
                    .finally(() => {
                      setVerifyingUsername(false)
                      setUsernameExistConfirmed(false)
                      setUsernameDontExistConfirmed(false)
                      setIsLoggingIn(false)
                    })
                }}
              >
                {loggingIn ? 'Registering...' : 'Register'}
              </button>
              <button
                onClick={() => {
                  setVerifyingUsername(false)
                  setUsernameExistConfirmed(false)
                  setUsernameDontExistConfirmed(false)
                  setTimeout(() => {
                    usernameInput.current && usernameInput.current.focus()
                  }, 0)
                }}
              >
                {'change username'}
              </button>
            </>
          )}

          {/* <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
              Learn React
            </a> */}
        </header>
      </div>
    </View>
  )
}
