import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { auth, getUserDocument } from 'firebase/config'
import { Button, Input, View } from 'components'
import { isEmpty } from 'lodash'
import * as images from 'images'

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
    <View fill>
      <img src={images.header} alt="header" style={{ maxHeight: '45%', maxWidth: '130%', objectFit: 'cover' }} />
      {loading ? (
        'loading...'
      ) : (
        <>
          {auth.currentUser ? (
            <View fill>
              {!!redirectClassroom && <Redirect to={redirectClassroom} />}
              <View row alignCenter bold fontSize={20} p={10}>
                <View mr={10}>Welcome {auth.currentUser.email.split('@')[0]}</View>
              </View>
              <View absolute bottom={10} left={10}>
                <Button
                  onClick={() => {
                    auth.signOut().then(() => {
                      forceUpdate(Date.now().valueOf())
                    })
                  }}
                >
                  Logout
                </Button>
              </View>
              <View alignCenter>
                <View>
                  <View ml={10}>Enter Class Code</View>
                  <Input style={{ width: 300, height: 36, marginBottom: 40 }} value="bcgamejam2019" />
                </View>

                <Button
                  disabled={joining}
                  style={{ width: 180, height: 50 }}
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
                          classCode: 'bcgamejam2019',
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
                  {joining ? 'Entering...' : 'ENTER CLASS'}
                </Button>
              </View>
            </View>
          ) : (
            <Redirect to="/login" />
          )}
        </>
      )}
    </View>
  )
}
