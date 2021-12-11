import React, { useEffect, useState } from 'react'
import {
  Input,
  Stack,
  FormControl,
  Box,
  Select,
  VStack,
  CheckIcon,
  Button,
  Spinner,
  Center
} from 'native-base'
import database from '@react-native-firebase/database'
import PropTypes from 'prop-types'

export const StartForm = ({ formik }) => {
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
        .then((snapshot) => {
          setOptionList(snapshot.val().topics)
          setSubOptionList(snapshot.val().subtopics)
          setLoading(false)
        })
    } catch (e) {
      throw new Error({
        ...e,
        path: 'getTopicsAndSubTopics-firebase-exception'
      })
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
      {loading ? (
        <Center h="100%" w="100%">
          <Spinner color="cyan.500" size="lg" />
        </Center>
      ) : (
        <Stack space={5}>
          <Stack>
            <FormControl
              isRequired
              isInvalid={'name' in formik.errors}
            >
              <FormControl.Label>Введите имя: </FormControl.Label>
              <Input
                value={formik.values.name}
                onChangeText={formik.handleChange('name')}
              />
              {formik.touched.name && formik.errors.name && (
                <FormControl.ErrorMessage>
                  {formik.errors.name}
                </FormControl.ErrorMessage>
              )}
            </FormControl>
          </Stack>

          <VStack>
            <FormControl isRequired isInvalid={'topics' in formik.errors}>
              <FormControl.Label>Выберите тему обращения: </FormControl.Label>
              <Select
                mt={1}
                minWidth="200"
                _selectedItem={{
                  bg: 'teal.600',
                  endIcon: <CheckIcon size="5" />
                }}
                placeholder="Выберите тему"
                accessibilityLabel="Choose Service"
                onValueChange={(itemValue) =>
                  formik.setFieldValue('topics', itemValue)
                }
              >
                {optionRenderList}
              </Select>
              {formik.touched.topics && formik.errors.topics && (
                <FormControl.ErrorMessage>
                  {formik.errors.topics}
                </FormControl.ErrorMessage>
              )}
            </FormControl>
          </VStack>

          <VStack>
            <FormControl
              isRequired
              isInvalid={'subtopics' in formik.errors}
            >
              <FormControl.Label>
                Выберите подтему обращения:{' '}
              </FormControl.Label>
              <Select
                mt={1}
                minWidth="200"
                placeholder="Выберите подтему"
                _selectedItem={{
                  bg: 'teal.600',
                  endIcon: <CheckIcon size="5" />
                }}
                accessibilityLabel="Choose Service"
                onValueChange={(itemValue) => {
                  console.log(itemValue)
                  formik.setFieldValue('subtopics', itemValue)
                }}
              >
                {subOptionRenderList}
              </Select>
              {formik.touched.subtopics && formik.errors.subtopics && (
                <FormControl.ErrorMessage>
                  {formik.errors.subtopics}
                </FormControl.ErrorMessage>
              )}
            </FormControl>
          </VStack>
  
          <Stack>
            <FormControl
              isRequired
              isInvalid={'message' in formik.errors}
            >
              <FormControl.Label>Введите суть обращения: </FormControl.Label>
              <Input
                value={formik.values.message}
                onChangeText={formik.handleChange('message')}
              />
              {formik.touched.message && formik.errors.message && (
                <FormControl.ErrorMessage>
                  {formik.errors.message}
                </FormControl.ErrorMessage>
              )}
            </FormControl>
          </Stack>

          <Button onPress={() => formik.handleSubmit()} colorScheme="blue">
            Войти в чат
          </Button>
        </Stack>
      )}
    </Box>
  )
}

StartForm.propTypes = {
  formik: PropTypes.object
}
