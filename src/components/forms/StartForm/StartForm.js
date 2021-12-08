import React, { useEffect, useState } from "react";
import {
  Input,
  Stack,
  FormControl,
  Box,
  Select,
  VStack,
  CheckIcon,
  Button, Spinner, Center,
} from "native-base";
import database from '@react-native-firebase/database';

export const StartForm = () => {
  
  const [optionList, setOptionList] = useState([])
  const [subOptionList, setSubOptionList] = useState([])
  
  // ui state
  const [loading, setLoading] = useState(false)
  
  const getTopicsAndSubTopics = async () => {
    try {
      setLoading(true)
      await database()
      .ref('topics/')
      .once('value')
      .then(snapshot => {
        setOptionList(snapshot.val().topics)
        setSubOptionList(snapshot.val().subtopics)
        setLoading(false)
      });
    } catch (e) {
      throw new Error({ ...e, path: 'getTopicsAndSubTopics-firebase-exception' });
    }
  }
  
  useEffect(() => {
    getTopicsAndSubTopics()
  }, [])
  
  // ! JSX Variables block
  
  const optionRenderList = optionList.map((option, index) => (
    <Select.Item key={index} label={option.label} value={option.value} />
  ))
  
  const subOptionRenderList = subOptionList.map((option, index) => (
    <Select.Item key={index} label={option.label} value={option.value} />
  ))
  
  return (
    <Box>
      <FormControl>
        {loading
          ? (
            <Center
              h='100%'
              w='100%'
            >
              <Spinner color="cyan.500" size="lg" />
            </Center>
          )
          : (
            <Stack space={5}>
              <Stack>
                <FormControl.Label>Введите имя: </FormControl.Label>
                <Input variant="underlined" p={2} placeholder="" />
              </Stack>
              <VStack>
                <FormControl.Label>Выберите тему обращения: </FormControl.Label>
                <Select
                  minWidth="200"
                  accessibilityLabel="Choose Service"
                  placeholder="Выберите тему"
                  _selectedItem={{
                    bg: 'teal.600',
                    endIcon: <CheckIcon size="5" />
                  }}
                  mt={1}
                  // onValueChange={(itemValue) => setService(itemValue)}
                >
                  {optionRenderList}
                </Select>
              </VStack>
              
              <VStack>
                <FormControl.Label>Выберите подтему обращения: </FormControl.Label>
                <Select
                  // selectedValue={service}
                  minWidth="200"
                  accessibilityLabel="Choose Service"
                  placeholder="Выберите подтему"
                  _selectedItem={{
                    bg: 'teal.600',
                    endIcon: <CheckIcon size="5" />
                  }}
                  mt={1}
                  // onValueChange={(itemValue) => setService(itemValue)}
                >
                  {subOptionRenderList}
                </Select>
              </VStack>
              
              <Button onPress={() => console.log('hello world')} colorScheme='blue'>Войти в чат</Button>
            </Stack>
          )
        }
      </FormControl>
    </Box>
  )
}
