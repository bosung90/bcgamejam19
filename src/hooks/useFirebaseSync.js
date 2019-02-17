import React, { useEffect } from 'react'
import { dispatch } from 'store'
import { auth, getUserDocument } from 'firebase/config'

export default function useFirebaseSync() {
  useEffect(() => {
    const unsubs = []
    let unsubsUserDoc = null
    const unsubscribeAuth = auth.onAuthStateChanged(user => {
      if (user) {
        unsubsUserDoc = getUserDocument(user.uid).onSnapshot(doc => {
          const userData = doc.data()
          dispatch.user.setUser(userData)
        })
        unsubs.push(unsubsUserDoc)
      } else {
        unsubsUserDoc && unsubsUserDoc()
        dispatch.user.setUser({})
      }
    })
    unsubs.push(unsubscribeAuth)
    return () => {
      for (const unsub of unsubs) {
        unsub && unsub()
      }
    }
  }, [])
}
