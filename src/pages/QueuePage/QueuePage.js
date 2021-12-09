import React, { useEffect, useState } from "react";
import ruLocale from 'date-fns/locale/ru'
import LottieView from 'lottie-react-native'
import formatDistanceStrict from 'date-fns/formatDistanceStrict'
import { Box, Button, Center, Flex, Heading, Text, VStack } from 'native-base'

import SmileLottie from '../../assets/lottie/smile.json'
import database from "@react-native-firebase/database";

export const QueuePage = () => {
  
  const [queueLength, setQueueLength] = useState(0)
  
  const getQueueLength = async () => {
    try {
      // setLoading(true)
      await database()
      .ref('chat/start/')
      .once('value')
      .then((snapshot) => {
        const tmp = Number(Object.keys(snapshot.val())[0]) + 1
        setQueueLength(tmp)
        // setLoading(false)
      })
    } catch (e) {
      throw new Error({
        ...e,
        path: 'getTopicsAndSubTopics-firebase-exception'
      })
    }
  }
  
  useEffect(() => {
    getQueueLength()
  }, [])
  
  // ! JSX Variables Block
  // время умножается на кол-во человек в очереди, 1 человек в очереди = 5 минут
  const durationTime = formatDistanceStrict(new Date(), new Date().getTime() + (queueLength * 50)*60*100, {locale: ruLocale})
  
  return (
    <Box width="100%" padding="15px">
      <Flex h='100%' w='100%' mt={6}>
        <Heading mt="10" w='100%'>
          <VStack w='100%' height='auto' >
            <Text fontSize="2xl" color='black'>Вы в очереди на {queueLength} месте</Text>
            {/*<Text fontSize="md" color='gray' w={250} >Вам ответят приблизительно через 10 минут и 10 секунд</Text>*/}
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
