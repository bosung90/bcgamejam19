import React from 'react'

export default function Classroom({ match }) {
  return <div>{match.params.classroomId}</div>
}
