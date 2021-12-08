import React from 'react'
import {
  Box
} from 'native-base'
import { useFormik } from 'formik'

import { StartForm } from "../../components/forms/StartForm/StartForm";
import { StartFormSchema } from "../../utils/validation";

export const HomePage = () => {
  const formik = useFormik({
    initialValues: {
      name: '',
      topics: '',
      subtopics: ''
    },
    validationSchema: StartFormSchema,
    onSubmit: values => {
      alert(JSON.stringify(values, null, 2));
    }
  })
  
  return (
    <Box
      width='100%'
      padding='15px'
    >
      <StartForm formik={formik} />
    </Box>
  )
}
