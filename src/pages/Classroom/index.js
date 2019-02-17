import React, { useEffect, useState } from 'react'
import { getClassroomDoc } from 'firebase/config'

export default function Classroom({ match }) {
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
  return <div>Welcome to {classroomData.name}</div>
}
