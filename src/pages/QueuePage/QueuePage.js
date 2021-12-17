import React, { useEffect, useState } from "react";
import ruLocale from 'date-fns/locale/ru'
import LottieView from 'lottie-react-native'
import OneSignal from 'react-native-onesignal'
import { Actions } from 'react-native-router-flux'
import database from '@react-native-firebase/database'
import { useDispatch, useSelector } from 'react-redux'
import { EventRegister } from 'react-native-event-listeners'
import formatDistanceStrict from 'date-fns/formatDistanceStrict'
import { Box, Button, Center, Heading, Text, VStack } from 'native-base'

import SmileLottie from '../../assets/lottie/smile.json'

export const QueuePage = () => {
  const delay = 10000
  const dispatch = useDispatch()
  const { idDialog } = useSelector((state) => state.dialog)

  const [queueLength, setQueueLength] = useState(0)

  const getQueueLength = async () => {
    try {
      await database()
        .ref('chat/start/')
        .limitToLast(1)
        .once('value')
        .then((snapshot) => {
          const tmp = Number(Object.keys(snapshot.val())[0]) + 1
          setQueueLength(tmp)
        })
    } catch (e) {
      // throw new Error({
      //   ...e,
      //   path: 'getTopicsAndSubTopics-firebase-exception'
      // })
      console.log(e)
    }
  }
  
  const checkDialogFromFirebase = () => {
    try {
      return new Promise((resolve) => {
        database()
          .ref(`chat/start/`)
          .orderByChild('uuid')
          .equalTo(idDialog)
          .on('child_removed', (snapshot) => {
            if (snapshot.val() !== null) {
              resolve({ isDelete: true, dialogDelete: snapshot.val() })
            }
          })
      })
    } catch (e) {
      console.log('error in checkDialogFromFirebase', e)
    }
  }

  const checkStartDialog = async () => {
    const isStartDialog = await checkDialogFromFirebase()
    if (isStartDialog.isDelete) {
      let newDialogSave = null
      await database()
        .ref('chat/active')
        .orderByChild('uuid')
        .equalTo(idDialog)
        .once('value')
        .then((snapshot) => {
          const tmp = Number(Object.keys(snapshot.val())[0])
          newDialogSave = snapshot.val()[tmp]
          EventRegister.emit('dialogStartEvent', newDialogSave)
        })
    }
  }

  const handleDialogChange = (data) => {
    dispatch({ type: 'SAVE_DIALOG', payload: { dialog: data } })
    dispatch({ type: 'DIALOG_START' })
  }

  useEffect(() => {
    getQueueLength()
  
    const myInterval = setInterval(() => {
      checkStartDialog()
    }, delay)

    const listener = EventRegister.addEventListener(
      'dialogStartEvent',
      handleDialogChange
    )
    return () => {
      EventRegister.removeEventListener(listener)
      clearInterval(myInterval)
    }
  }, [])

  const _openPanel = () => {
    Actions.dialog()
  }

  const onReceived = () => {
    console.log('onReceived')
  }

  const onOpened = (openResult) => {
    const payload = openResult.notification.payload
    console.log(payload)
    _openPanel()
  }

  const saveDeviceIdInFirebase = async (userId) => {
    await database()
    .ref(`chat/start/`)
    .orderByChild('uuid')
    .equalTo(idDialog)
    .on('value', (snapshot) => {
      const tmp = Number(Object.keys(snapshot.val()))
      const dialog = snapshot.val()[tmp]
      snapshot.forEach((child) => {
        child.ref.set(({
          ...dialog,
          deviceId: userId
        }))
      })
    })
  }
  
  const onIds = (device) => {
    console.log('[INFO] Device: ', device)
    if (idDialog !== null) {
      OneSignal.sendTag('custom_id', idDialog.toString())
      OneSignal.sendTag('id_device', device.userId.toString())
      saveDeviceIdInFirebase(device.userId)
    }
  }

  const handlerButton = () => {
    console.log('нажали кнопочку')

    OneSignal.inFocusDisplaying(2)
    OneSignal.init('23e26e2f-9643-4633-8055-e32259dae838')

    OneSignal.addEventListener('received', onReceived)
    OneSignal.addEventListener('opened', onOpened)
    OneSignal.addEventListener('ids', onIds)

    return () => {
      OneSignal.removeEventListener('received', onReceived)
      OneSignal.removeEventListener('opened', onOpened)
      OneSignal.removeEventListener('ids', onIds)
    }
  }

  // ! JSX Variables Block
  // время умножается на кол-во человек в очереди, 1 человек в очереди = 5 минут
  const durationTime = formatDistanceStrict(
    new Date(),
    new Date().getTime() + queueLength * 50 * 60 * 100,
    { locale: ruLocale }
  )

  return (
    <Box h="100%" width="100%" padding="15px">
      <Box h="100%" w="100%" display="flex" flexDirection="column" justifyContent="space-between" >
        <Heading w="100%">
          <VStack w="100%" height="auto">
            <Text fontSize="2xl" color="black">
              Вы в очереди на {queueLength} месте
            </Text>
            <Text fontSize="md" color="gray" w={250}>
              Вам ответят приблизительно через {durationTime}
            </Text>
          </VStack>
        </Heading>
        <Center style={{ margin: 0, padding: 0 }}>
          <LottieView
            source={SmileLottie}
            autoPlay
            loop
            style={{ width: 450, height: 350, margin: 0, padding: 0 }}
          />
        </Center>
        <Button
          width="100%"
          variant="outline"
          colorScheme="secondary"
          onPress={() => handlerButton()}
        >
          Напомнить когда придет очередь
        </Button>
      </Box >
    </Box>
  )
}
