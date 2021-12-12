import React, { useState } from "react";
import { AddIcon, ArrowForwardIcon, Box, Flex, Input } from "native-base";

export const SendComponent = ({onSend}) => {
  
  const [value, setValue] = useState('')
  
  const handlerSend = () => {
    onSend(value)
    setValue('')
  }
  
  return (
    <>
      <Box width="100%" height="10%" flex="1" safeAreaTop>
        <Flex
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <AddIcon width="10%" size="4" ml="3" />
          <Input
            width="80%"
            value={value}
            variant="filled"
            placeholder="Напишите собщение..."
            onChangeText={(value) => setValue(value)}
          />
          <ArrowForwardIcon
            mr="3"
            size="6"
            width="10%"
            onPress={handlerSend}
          />
        </Flex>
      </Box>
    </>
  )
}
