import React from 'react'
import { Box, Button, Center, Flex, Heading, Text, VStack } from 'native-base'
import LottieView from 'lottie-react-native'

import SmileLottie from '../../assets/lottie/smile.json'

export const QueuePage = () => {
  return (
    <Box width="100%" padding="15px">
      <Flex h='100%' w='100%' mt={6}>
        <Heading mt="10" w='100%'>
          <VStack w='100%' height='auto' >
            <Text fontSize="2xl" color='black'>Вы в очереди на 3 месте</Text>
            <Text fontSize="md" color='gray' w={250} >Вам ответят приблизительно через 10 минут и 10 секунд</Text>
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
