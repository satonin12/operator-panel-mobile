import React from 'react'
import { Box } from 'native-base'
import { useFormik } from 'formik'
import { firebase } from '@react-native-firebase/database'
import uuid from 'react-native-uuid'
import {Actions} from 'react-native-router-flux'
import { useDispatch } from 'react-redux'

import { StartForm } from '../../components/forms/StartForm/StartForm'
import { StartFormSchema } from '../../utils/validation'

export const HomePage = () => {
  
  const dispatch = useDispatch()
  
  const createDialogFromBack = async (values) => {
    console.log('зашли сюда')
    let lengthActiveDialogs
    // создаем запись
    // для этого узнаем длину последнего элемента в очереди
    await firebase
      .database()
      .ref('chat/start/')
      // .limitToLast(1)
      .once('value', (snapshot) => {
        if (snapshot.val() === 'null' || snapshot.val() === null) {
          lengthActiveDialogs = 0
        } else {
          const lengthDialogs = Object.keys(snapshot.val())
          lengthActiveDialogs = Number(lengthDialogs[lengthDialogs.length - 1]) + 1
        }
      })
    const timestamp = new Date()
    const newDialog = {
      operatorId: 0, // оператор пока что не присвоен => 0
      status: 'start', // статус диалога - очередь
      uuid: uuid.v4(),
      name: values.name,
      avatar: '',
      messages: [
        {
          content: values.message,
          writtenBy: 'client',
          timestamp: timestamp.toISOString()
        }
      ]
    }
    
    await firebase
      .database()
      .ref(`chat/start/${lengthActiveDialogs}`)
      .set(newDialog, (error) => {
        if (error) {
          console.log(error)
        } else {
          console.log('добавление прошло удачно - смотри firebase')
        }
      })
  
    dispatch({type: 'SAVE_DIALOG', payload: { ...newDialog }})
    // переводим на экран ожидания очереди
    Actions.queue()
  }

  const formik = useFormik({
    initialValues: {
      name: '',
      topics: '',
      subtopics: '',
      message: ''
    },
    validationSchema: StartFormSchema,
    onSubmit: (values) => {
      createDialogFromBack(values)
    }
  })

  return (
    <Box width="100%" padding="15px">
      <StartForm formik={formik} />
    </Box>
  )
}
