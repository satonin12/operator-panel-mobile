import React, { useEffect } from 'react'
import { Text } from 'native-base'
import { useSelector } from 'react-redux'
import database from '@react-native-firebase/database'

export const DialogPage = () => {
  const { isDialogOpen, idDialog } = useSelector((state) => state.dialog)

  const getMessages = async () => {
    try {
      await database()
        .ref('chat/active/')
        .orderByChild('uuid')
        .equalTo(idDialog)
        .once('value')
        .then((snapshot) => {
          console.log('getMessages ', snapshot.val())
        })
    } catch (e) {
      console.log('error getMessages, ', e)
    }
  }

  useEffect(() => {
    getMessages()
  }, [])

  return isDialogOpen ? (
    <Text>This is Dialog Page !!! isDialogOpen = {isDialogOpen}</Text>
  ) : (
    <Text>Открылась по ошибке !!! isDialogOpen = {isDialogOpen}</Text>
  )
}
