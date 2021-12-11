import React, { useEffect, useState } from "react";
import ruLocale from 'date-fns/locale/ru'
import LottieView from 'lottie-react-native'
import formatDistanceStrict from 'date-fns/formatDistanceStrict'
import { Box, Button, Center, Flex, Heading, Text, VStack } from 'native-base'
import { useDispatch, useSelector } from "react-redux";

import SmileLottie from '../../assets/lottie/smile.json'
import database from "@react-native-firebase/database";
import useInterval from "../../hooks/useInterval";
import { Actions } from "react-native-router-flux";

export const QueuePage = () => {
  
  const [queueLength, setQueueLength] = useState(0)
  const [indexDialog, setIndexDialog] = useState(null)
  const state = useSelector((state => state.dialog))
  const dispatch = useDispatch()
  
  console.log('state.isDialogOpen ', state.isDialogOpen)
  const getQueueLength = async () => {
    try {
      // setLoading(true)
      await database()
      .ref('chat/start/')
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
      return new Promise(resolve => {
        database()
        .ref(`chat/start/${indexDialog}`).on('child_removed', (snapshot) => {
          if(snapshot.val() !== null) {
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
    if(isStartDialog.isDelete) {
      dispatch({type: 'DIALOG_START'})
      Actions.dialog()
    }
  }
  
  useEffect(() => {
    getQueueLength()
  }, [])
  
  useInterval(() => {
    checkStartDialog()
  }, !state.isDialogOpen ? 10000: null) // 30 sec.
  
  // ! JSX Variables Block
  // время умножается на кол-во человек в очереди, 1 человек в очереди = 5 минут
  const durationTime = formatDistanceStrict(new Date(), new Date().getTime() + (queueLength * 50)*60*100, {locale: ruLocale})
  
  return (
    <Box width="100%" padding="15px">
      <Flex h='100%' w='100%' mt={6}>
        <Heading mt="10" w='100%'>
          <VStack w='100%' height='auto' >
            <Text fontSize="2xl" color='black'>Вы в очереди на {queueLength} месте</Text>
            <Text fontSize="md" color='gray' w={250} >Вам ответят приблизительно через {durationTime}</Text>
          </VStack>
        </Heading>
        <Center mt={10} style={{margin: 0, padding: 0}}>
          <LottieView source={SmileLottie} autoPlay loop style={{width: 450, height: 350, margin: 0, padding: 0}} />
        </Center>
        <Button width="100%" variant="outline" colorScheme="secondary" mt={10}>
          Напомнить когда придет очередь
        </Button>
      </Flex>
    </Box>
  )
}
