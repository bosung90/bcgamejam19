import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { auth, getUserDocument } from 'firebase/config'
import { View } from 'components'
import { isEmpty } from 'lodash'

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(false)
  const [redirectClassroom, setRedirectClassroom] = useState()
  const [, forceUpdate] = useState()
  useEffect(() => {
    return auth.onAuthStateChanged(user => {
      setLoading(false)
      if (user) {
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
                disabled={joining}
                onClick={() => {
                  setJoining(true)
                  auth.currentUser.getIdToken().then(token => {
                    fetch(process.env.REACT_APP_FUNCTIONS_URL + 'joinClass', {
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
                        return getUserDocument(auth.currentUser.uid).get()
                      })
                      .then(doc => {
                        const userData = doc.data() || {}
                        if (!isEmpty(userData.joinedClasses)) {
                          setRedirectClassroom('/classroom/' + Object.keys(userData.joinedClasses)[0])
                        }
                      })
                      .finally(() => {
                        setJoining(false)
                      })
                  })
                }}
              >
                <View cursor="pointer" fontSize={50} bg="#7235A1" color="white" br={50} p={10}>
                  Join Class
                </View>
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
