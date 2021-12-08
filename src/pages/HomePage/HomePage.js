import React from 'react'
import {
  Box
} from 'native-base'
import { StartForm } from "../../components/forms/StartForm/StartForm";

export const HomePage = () => {
  return (
    <Box
      width='100%'
      padding='15px'
    >
      <StartForm/>
    </Box>
  )
}
