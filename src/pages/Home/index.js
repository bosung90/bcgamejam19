import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { auth, getUserDocument } from 'firebase/config'
import { View } from 'components'
import { isEmpty } from 'lodash'

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [redirectClassroom, setRedirectClassroom] = useState()
  const [, forceUpdate] = useState()
  useEffect(() => {
    return auth.onAuthStateChanged(user => {
      setLoading(false)
      if (user) {
        console.log(user.uid)
        getUserDocument(user.uid)
          .get()
          .then(doc => {
            const userData = doc.data() || {}
            if (!isEmpty(userData.joinedClasses)) {
              setRedirectClassroom('/classroom/' + Object.keys(userData.joinedClasses)[0])
            }
          })
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
              {!!redirectClassroom && <Redirect to={redirectClassroom} />}
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
