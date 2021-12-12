import React, { useEffect, useState } from 'react'
import ruLocale from 'date-fns/locale/ru'
import LottieView from 'lottie-react-native'
import formatDistanceStrict from 'date-fns/formatDistanceStrict'
import { Box, Button, Center, Flex, Heading, Text, VStack } from 'native-base'
import { useDispatch, useSelector } from 'react-redux'

import SmileLottie from '../../assets/lottie/smile.json'
import database from '@react-native-firebase/database'
import useInterval from '../../hooks/useInterval'
import { Actions } from 'react-native-router-flux'
import OneSignal from 'react-native-onesignal'

export const QueuePage = () => {
  const [queueLength, setQueueLength] = useState(0)
  const [indexDialog, setIndexDialog] = useState(null)
  const state = useSelector((state) => state.dialog)
  const dispatch = useDispatch()

  const getQueueLength = async () => {
    try {
      // setLoading(true)
      await database()
        .ref('chat/start/')
        .limitToLast(1)
        .once('value')
        .then((snapshot) => {
          const tmp = Number(Object.keys(snapshot.val())[0]) + 1
          setQueueLength(tmp)
        })

      await database()
        .ref('chat/start/')
        .orderByChild('uuid')
        .equalTo(state.idDialog)
        .once('value')
        .then((snapshot) => {
          const tmp = Number(Object.keys(snapshot.val())[0])
          setIndexDialog(tmp)
        })
    } catch (e) {
      throw new Error({
        ...e,
        path: 'getTopicsAndSubTopics-firebase-exception'
      })
    }
  }

  const checkDialogFromFirebase = () => {
    console.log('checkDialogFromFirebase')
    try {
      return new Promise((resolve) => {
        database()
          .ref(`chat/start/${indexDialog}`)
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
      dispatch({ type: 'DIALOG_START' })
      Actions.dialog()
    }
  }
  
  const _openPanel = () => { Actions.dialog() };
  
  const onReceived = () => {
    console.log('onReceived');
  };
  
  const onOpened = (openResult) => {
    console.log('открыли нотификацию');
    const payload = openResult.notification.payload;
    console.log('payload ', payload);
  
    _openPanel();
  };
  
  const onIds = (device) => {
    console.log('[INFO] Device: ', device);
  };
  
  useEffect(() => {
    getQueueLength()
    
    OneSignal.inFocusDisplaying(2);
    OneSignal.init('23e26e2f-9643-4633-8055-e32259dae838');
  
    OneSignal.addEventListener('received', onReceived);
    OneSignal.addEventListener('opened', onOpened);
    OneSignal.addEventListener('ids', onIds);
  
    // TODO: replace to PLAYER ID
    if(state.idDialog !== null) {
      OneSignal.sendTag('custom_id', state.idDialog.toString());
    }
  
    return () => {
      OneSignal.removeEventListener('received', onReceived);
      OneSignal.removeEventListener('opened', onOpened);
      OneSignal.removeEventListener('ids', onIds);
    };
  }, [])

  useInterval(
    () => {
      checkStartDialog()
    },
    !state.isDialogOpen ? 2000 : null
  ) // 30 sec.

  const handlerButton = () => {
    console.log('нажали кнопочку')

  }

  // ! JSX Variables Block
  // время умножается на кол-во человек в очереди, 1 человек в очереди = 5 минут
  const durationTime = formatDistanceStrict(
    new Date(),
    new Date().getTime() + queueLength * 50 * 60 * 100,
    { locale: ruLocale }
  )

  return (
    <Box width="100%" padding="15px">
      <Flex h="100%" w="100%" mt={6}>
        <Heading mt="10" w="100%">
          <VStack w="100%" height="auto">
            <Text fontSize="2xl" color="black">
              Вы в очереди на {queueLength} месте
            </Text>
            <Text fontSize="md" color="gray" w={250}>
              Вам ответят приблизительно через {durationTime}
            </Text>
          </VStack>
        </Heading>
        <Center mt={10} style={{ margin: 0, padding: 0 }}>
          <LottieView
            source={SmileLottie}
            autoPlay
            loop
            style={{ width: 450, height: 350, margin: 0, padding: 0 }}
          />
        </Center>
        <Button
          mt={10}
          width="100%"
          variant="outline"
          colorScheme="secondary"
          onPress={() => handlerButton()}
        >
          Напомнить когда придет очередь
        </Button>
      </Flex>
    </Box>
  )
}
