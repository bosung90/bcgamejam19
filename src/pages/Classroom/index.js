import React, { useEffect, useState } from 'react'
import { getClassroomDoc, getClassroomStudentsCollection } from 'firebase/config'
import { auth } from 'firebase/config'
import { Button, Select, View } from 'components'
import * as images from 'images'
import { css } from 'emotion'
import { dispatch } from 'store'
import { Redirect } from 'react-router-dom'

let eyeIndex = 0
let mouthIndex = 0
let cheekIndex = 0
let hairIndex = 0
let skinIndex = 0
let costumeIndex = 0

export default function Classroom({ match }) {
  const [classroomData, setClassroomData] = useState({})
  const [studentsData, setStudentsData] = useState({})
  useEffect(() => {
    if (match.params.classroomId) {
      const unsubsClassroom = getClassroomDoc(match.params.classroomId).onSnapshot(doc => {
        const classroomData = doc.data() || {}
        classroomData.id = doc.id
        setClassroomData(classroomData)
      })
      const unsubsClassroomStudents = getClassroomStudentsCollection(match.params.classroomId).onSnapshot(docs => {
        const studentsData = {}
        docs.forEach(doc => {
          studentsData[doc.id] = doc.data()
          studentsData[doc.id].id = doc.id
        })
        setStudentsData(studentsData)
      })
      return () => {
        unsubsClassroom()
        unsubsClassroomStudents()
      }
    }
  }, [])
  return (
    <View fill color="white">
      <img className={styles.classroomBG} src={images.classroomBG} alt="classroom background" />
      <View p={10}>
        <View row alignCenter>
          <View mr={20}>Welcome to {classroomData.name} </View>
          <Button
            onClick={() => {
              auth.signOut().then(() => {
                window.location.href = '/'
              })
            }}
          >
            Logout
          </Button>
        </View>
      </View>
      <View w="100%" alignCenter>
        <View w="50%" bc="#7330A3" br={50} bw={4} relative>
          <img
            className={styles.animation}
            style={{
              position: 'absolute',
              width: 60,
              top: -10,
              left: -40,
            }}
            src={images.purpleButton}
            alt="purple circle button"
          />
          <View w={30} h={30} bg="white" center absolute br={15} color="#7330A3" left={-54} bottom={-14} bold>
            {Math.floor(classroomData.xp / 1001) + 1 || 1}
          </View>
          {Math.floor(classroomData.xp / 1001) + 1 >= 10 && (
            <Redirect to={`/classroom/${match.params.classroomId}/bossFight/${classroomData.bossId}`} />
          )}
          <img
            style={{
              width: Math.min((classroomData.xp % 1000.0000001) / 1000 || 0, 1) * 100 + '%',
              height: 40,
              borderRadius: 50,
              transition: 'width 0.5s',
            }}
            src={images.yellowBar}
            alt="yellow health bar"
          />
        </View>
      </View>
      <View p={10} alignCenter>
        <View row>
          <Button
            onClick={() => {
              const eyeItems = dispatch.items.getItems('eye')
              const selectedEyeItem = Object.values(eyeItems)[eyeIndex]
              if (selectedEyeItem) {
                dispatch.user.setItem('eye', selectedEyeItem.id, match.params.classroomId)
              } else {
                dispatch.user.setItem('eye', '', match.params.classroomId)
              }
              eyeIndex = (eyeIndex + 1) % Object.keys(eyeItems).length
            }}
          >
            Eye
          </Button>
          <Button
            onClick={() => {
              const skinItems = dispatch.items.getItems('skin')
              const selectedSkinItem = Object.values(skinItems)[skinIndex]
              if (selectedSkinItem) {
                dispatch.user.setItem('skin', selectedSkinItem.id, match.params.classroomId)
              } else {
                dispatch.user.setItem('skin', '', match.params.classroomId)
              }
              skinIndex = (skinIndex + 1) % Object.keys(skinItems).length
            }}
          >
            Skin
          </Button>
          <Button
            onClick={() => {
              const cheekItems = dispatch.items.getItems('cheek')
              const selectedCheekItem = Object.values(cheekItems)[cheekIndex]
              if (selectedCheekItem) {
                dispatch.user.setItem('cheek', selectedCheekItem.id, match.params.classroomId)
              } else {
                dispatch.user.setItem('cheek', '', match.params.classroomId)
              }
              cheekIndex = (cheekIndex + 1) % (Object.keys(cheekItems).length + 1)
            }}
          >
            Cheek
          </Button>
          <Button
            onClick={() => {
              const mouthItems = dispatch.items.getItems('mouth')
              const selectedMouthItem = Object.values(mouthItems)[mouthIndex]
              if (selectedMouthItem) {
                dispatch.user.setItem('mouth', selectedMouthItem.id, match.params.classroomId)
              } else {
                dispatch.user.setItem('mouth', '', match.params.classroomId)
              }
              mouthIndex = (mouthIndex + 1) % Object.keys(mouthItems).length
            }}
          >
            Mouth
          </Button>
          <Button
            onClick={() => {
              const hairItems = dispatch.items.getItems('hair')
              const selectedHairItem = Object.values(hairItems)[hairIndex]
              if (selectedHairItem) {
                dispatch.user.setItem('hair', selectedHairItem.id, match.params.classroomId)
              } else {
                dispatch.user.setItem('hair', '', match.params.classroomId)
              }
              hairIndex = (hairIndex + 1) % (Object.keys(hairItems).length + 1)
            }}
          >
            Hair
          </Button>
          <Button
            onClick={() => {
              const costumeItems = dispatch.items.getItems('costume')
              const selectedCostumeItem = Object.values(costumeItems)[costumeIndex]
              if (selectedCostumeItem) {
                dispatch.user.setItem('costume', selectedCostumeItem.id, match.params.classroomId)
              } else {
                dispatch.user.setItem('costume', '', match.params.classroomId)
              }
              costumeIndex = (costumeIndex + 1) % (Object.keys(costumeItems).length + 1)
            }}
          >
            Costume
          </Button>
        </View>
      </View>
      <View absolute bottom={30} left={0} right={0} alignCenter>
        <Button
          className={styles.animation}
          onClick={() => {
            getClassroomDoc(match.params.classroomId).update({
              xp: classroomData.xp + 50,
            })
          }}
        >
          Complete Assignments
        </Button>
      </View>
      <View absolute right={30} bottom={30} zIndex={2}>
        <Button
          onClick={() => {
            window.location.href = `/classroom/${match.params.classroomId}/bossFight/${classroomData.bossId}`
          }}
        >
          To Boss
        </Button>
      </View>

      <View pointerEvents="none" absoluteFill>
        <Select selector={dispatch.user.getId}>
          {userId => <MyCharacter key={userId} {...studentsData[userId]} />}
        </Select>
        <Select selector={dispatch.user.getId}>
          {userId =>
            Object.values(studentsData)
              .reduce((prev, cur) => {
                if (cur.id !== userId) {
                  prev.push(cur)
                }
                return prev
              }, [])
              .map((student, index) => <Character key={student.id} index={index} {...student} />)
          }
        </Select>
      </View>
    </View>
  )
}

function MyCharacter(props) {
  const skinItem = dispatch.items.getItems()[props.skinId] || {}
  const eyeItem = dispatch.items.getItems()[props.eyeId] || {}
  const cheekItem = dispatch.items.getItems()[props.cheekId] || {}
  const mouthItem = dispatch.items.getItems()[props.mouthId] || {}
  const costumeItem = dispatch.items.getItems()[props.costumeId] || {}
  const hairItem = dispatch.items.getItems()[props.hairId] || {}
  return (
    <View className={styles.animation} pointerEvents="none" absolute left={0} right={0} bottom={'33%'} alignCenter>
      <View absolute top={-20} bold color="#FED04A" fontSize={26}>
        {!!props.characterName && props.characterName.toUpperCase()}
      </View>
      {!!skinItem.imageUrl && <img src={skinItem.imageUrl} alt="skin" style={{ width: 300 }} />}
      {!!eyeItem.imageUrl && <img src={eyeItem.imageUrl} alt="eye" style={{ width: 300, position: 'absolute' }} />}
      {!!cheekItem.imageUrl && (
        <img src={cheekItem.imageUrl} alt="cheek" style={{ width: 300, position: 'absolute' }} />
      )}
      {!!mouthItem.imageUrl && (
        <img src={mouthItem.imageUrl} alt="mouth" style={{ width: 300, position: 'absolute' }} />
      )}
      {!!costumeItem.imageUrl && (
        <img src={costumeItem.imageUrl} alt="costume" style={{ width: 300, position: 'absolute' }} />
      )}
      {!!hairItem.imageUrl && <img src={hairItem.imageUrl} alt="hair" style={{ width: 300, position: 'absolute' }} />}
    </View>
  )
}

function Character(props) {
  const skinItem = dispatch.items.getItems()[props.skinId] || {}
  const eyeItem = dispatch.items.getItems()[props.eyeId] || {}
  const cheekItem = dispatch.items.getItems()[props.cheekId] || {}
  const mouthItem = dispatch.items.getItems()[props.mouthId] || {}
  const costumeItem = dispatch.items.getItems()[props.costumeId] || {}
  const hairItem = dispatch.items.getItems()[props.hairId] || {}

  return (
    <View pointerEvents="none" absolute left={5 + 8 * (props.index % 8) + '%'} bottom={props.index < 9 ? '20%' : '5%'}>
      <View absolute alignCenter textCenter left={0} right={0} top={-20} bold color="#FED04A" fontSize={14}>
        {!!props.characterName && props.characterName.toUpperCase()}
      </View>
      {!!skinItem.imageUrl && <img src={skinItem.imageUrl} alt="skin" style={{ width: 100 }} />}
      {!!eyeItem.imageUrl && <img src={eyeItem.imageUrl} alt="eye" style={{ width: 100, position: 'absolute' }} />}
      {!!cheekItem.imageUrl && (
        <img src={cheekItem.imageUrl} alt="cheek" style={{ width: 100, position: 'absolute' }} />
      )}
      {!!mouthItem.imageUrl && (
        <img src={mouthItem.imageUrl} alt="mouth" style={{ width: 100, position: 'absolute' }} />
      )}
      {!!costumeItem.imageUrl && (
        <img src={costumeItem.imageUrl} alt="costume" style={{ width: 100, position: 'absolute' }} />
      )}
      {!!hairItem.imageUrl && <img src={hairItem.imageUrl} alt="hair" style={{ width: 100, position: 'absolute' }} />}
    </View>
  )
}

const styles = {
  classroomBG: css({
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    zIndex: -1,
  }),
  animation: css({
    animation: 'pulsate 1s infinite',
    '@keyframes pulsate': {
      '0%': {
        transform: 'scaleX(1) scaleY(1)',
      },
      '50%': {
        transform: 'scaleX(1.05) scaleY(1.05)',
      },
    },
  }),
}
