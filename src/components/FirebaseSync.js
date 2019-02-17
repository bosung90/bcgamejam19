import React, { useEffect } from 'react'
import { dispatch } from 'store'
import { auth } from 'firebase/config'

export default function FirebaseSync() {
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(user => {
      if (user) {
        console.log('Logged In')
      } else {
        console.log('Not Logged In')
        unsubscribeAuth()
      }
    })
    return unsubscribeAuth
  }, [])
}
