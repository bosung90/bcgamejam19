import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { auth } from 'firebase/config'

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [, forceUpdate] = useState()
  useEffect(() => {
    return auth.onAuthStateChanged(user => {
      setLoading(false)
    })
  }, [])

  return (
    <div>
      {loading ? (
        'loading...'
      ) : (
        <>
          {auth.currentUser && (
            <>
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
            </>
          )}
          {!auth.currentUser && <Redirect to="/login" />}
        </>
      )}
    </div>
  )
}
