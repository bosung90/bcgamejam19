import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { auth } from 'firebase/config'
import { View } from 'components'

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [, forceUpdate] = useState()
  useEffect(() => {
    return auth.onAuthStateChanged(user => {
      setLoading(false)
      if (user) {
      }
    })
  }, [])

  return (
    <div>
      {loading ? (
        'loading...'
      ) : (
        <>
          {auth.currentUser ? (
            <View fill>
              <View row>
                Welcome {auth.currentUser.email.split('@')[0]}
                <button
                  onClick={() => {
                    auth.signOut().then(() => {
                      forceUpdate(Date.now().valueOf())
                    })
                  }}
                >
                  Logout
                </button>
              </View>

              <button
                onClick={() => {
                  auth.currentUser.getIdToken().then(token => {
                    console.log(token)

                    // fetch('https://us-central1-bcgamejam19.cloudfunctions.net/joinClass', {
                    fetch('http://localhost:5000/bcgamejam19/us-central1/joinClass', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: token,
                      },
                      body: JSON.stringify({
                        classCode: 'abcdefg',
                      }),
                    })
                      .then(result => result.json())
                      .then(json => {
                        console.log(json.success)
                      })
                  })
                }}
              >
                <View fontSize={70}>+</View>
              </button>
            </View>
          ) : (
            <Redirect to="/login" />
          )}
        </>
      )}
    </div>
  )
}
