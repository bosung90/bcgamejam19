import { getClassroomStudentDocument } from 'firebase/config'

export default {
  state: {},
  reducers: {
    setUser(state, payload) {
      return payload
    },
  },
  actions: ({ dispatch, getState }) => ({
    getId() {
      return getState().user.id
    },
    setItem(type, itemId, classroomId) {
      const userId = dispatch.user.getId()
      switch (type) {
        case 'eye':
          getClassroomStudentDocument(classroomId, userId).update({
            eyeId: itemId,
          })
          break
        case 'skin':
          getClassroomStudentDocument(classroomId, userId).update({
            skinId: itemId,
          })
          break
        case 'cheek':
          getClassroomStudentDocument(classroomId, userId).update({
            cheekId: itemId,
          })
          break
        case 'mouth':
          getClassroomStudentDocument(classroomId, userId).update({
            mouthId: itemId,
          })
          break
        case 'costume':
          getClassroomStudentDocument(classroomId, userId).update({
            costumeId: itemId,
          })
          break
        case 'hair':
          getClassroomStudentDocument(classroomId, userId).update({
            hairId: itemId,
          })
          break
        default:
          break
      }
    },
  }),
}
