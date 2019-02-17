import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import { auth } from 'firebase/config'

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [, forceUpdate] = useState()

  auth.onAuthStateChanged(user => {
    setLoading(false)
  })
  return (
    <div>
      {loading ? (
        'loading...'
      ) : (
        <>
          {!loading && auth.currentUser && (
            <button
              onClick={() => {
                auth.signOut().then(() => {
                  forceUpdate(Date.now().valueOf())
                })
              }}
            >
              Logout
            </button>
          )}
          {!loading && !auth.currentUser && <Redirect to="/login" />}
        </>
      )}
    </div>
  )
}
