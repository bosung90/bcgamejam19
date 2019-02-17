import React, { useState, useRef } from 'react'
import logo from 'logo.svg'
import 'App.css'
import { View } from 'components'
import { auth, getUserDocument } from 'firebase/config'
import { Redirect } from 'react-router-dom'
import * as images from 'images'
import { css } from 'emotion'

const EMAIL_DOMAIN = '@vampster.ca'

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

  function checkUsername() {
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
  }
  return (
    <View fill>
      <img src={images.header} alt="header" style={{ height: '45%', width: '100%', resizeMode: 'cover' }} />
      {!!auth.currentUser && <Redirect to="/" />}
      <div className={styles.bannertext}><h1>AstroHamsters</h1></div>
      <View className={styles.position}>
      <View w={300} className={styles.positionbox}>
        <div style={{fontWeight: 'bold', paddingLeft: 10, alignItems: 'flex-start'}}>Username</div>
        <input
          className={styles.input}
          autoFocus
          ref={usernameInput}
          disabled={usernameExistConfirmed || usernameDontExistConfirmed || verifyingUsername || loggingIn}
          value={username}
          onKeyPress={e => {
            if (e.key === 'Enter') {
              checkUsername()
            }
          }}
          onChange={e => setUsername(e.target.value.trim().toLocaleLowerCase())}
        />
        {(usernameExistConfirmed || usernameDontExistConfirmed) && (
          <>
            <div style={{fontWeight: 'bold', paddingLeft: 10}}>Password</div>
            <input
              className={styles.input}
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
            <div style={{fontWeight: 'bold', paddingLeft: 10}}>Name</div>
            <input className={styles.input} ref={nameInput} value={name} onChange={e => setName(e.target.value)} />
          </>
        )}
        {!usernameExistConfirmed && !usernameDontExistConfirmed && (
          <button
            className={styles.button}
            onClick={() => {
              checkUsername()
            }}
            disabled={verifyingUsername}
          >
            {verifyingUsername ? 'Checking...' : 'Next'}
          </button>
        )}
        {usernameExistConfirmed && (
          <button
            className={styles.button}
            disabled={loggingIn}
            onClick={() => {
              setIsLoggingIn(true)
              auth
                .signInWithEmailAndPassword(username + EMAIL_DOMAIN, password)
                .then(res => {})
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
              className={styles.button}
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
              className={styles.button}
              onClick={() => {
                setVerifyingUsername(false)
                setUsernameExistConfirmed(false)
                setUsernameDontExistConfirmed(false)
                setTimeout(() => {
                  usernameInput.current && usernameInput.current.focus()
                }, 0)
              }}
            >
              {'Change Username'}
            </button>
          </>
        )}
      </View>
      </View>
    </View>
  )
}

const styles = {
  position: css({
   alignItems: 'center',
   marginTop: 15,
  }),
  positionbox: css({
    //alignItems: 'flex-start',
    marginBottom: '15',
  }),
  input: css({
    margin: 4,
    paddingLeft: 10,
    height: 30,
    borderWidth: 3,
    borderColor: '#7235A1',
    borderStyle: 'solid',
    borderRadius: 30,
    fontSize: 18,
  }),
  bannertext: css({
  position: 'relative',
  textAlign: 'center',
  color: 'black',
  }),

  button: css({
    margin: 5,
    marginTop: 10,
    marginLeft:25,
    height: 36,
    backgroundColor: '#7235A1',
    borderRadius: 30,
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    width: '80%',
  }),

}
