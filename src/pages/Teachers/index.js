import React, { useEffect, useState } from 'react'
import { getClassroomDoc } from 'firebase/config'
import { auth } from 'firebase/config'
import { css } from 'emotion'

export default function Teachers({ match }) {
  const [classroomData, setClassroomData] = useState({})
  useEffect(() => {
    if (match.params.classroomId) {
      return getClassroomDoc(match.params.classroomId).onSnapshot(doc => {
        const classroomData = doc.data() || {}
        classroomData.id = doc.id
        setClassroomData(classroomData)
      })
    }
  }, [])
  return (
    <div>
      Welcome to {classroomData.name}{' '}
      <button
        onClick={() => {
          auth.signOut().then(() => {
            window.location.href = '/'
          })
        }}
      >
        Logout
      </button>
    </div>
  )
}
