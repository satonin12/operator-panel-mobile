import React from 'react'
import {
  Box,
  Button,
  Flex,
  Text,
} from 'native-base'
import { TouchableHighlight } from 'react-native'
import { useDispatch } from 'react-redux'


export const MyAppBar = () => {
  const dispatch = useDispatch()
  
  const handlerExitDialog = () => {
    // TODO: add Alert.Dialog to answer exit
    dispatch({type: 'CLEAR_STATE'})
  }
  
  return (
    <>
      <Box width="100%" height="10%" flex="1" safeAreaTop>
        <Flex
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Text fontSize="xl" px="3" bold>
            Alexander Division's
          </Text>
          <TouchableHighlight width="30%" height="100%">
            <Button height="100%" variant="outline" style={{ fontSize: 10 }} onPress={handlerExitDialog}>
              Завершить диалог
            </Button>
          </TouchableHighlight>
        </Flex>
      </Box>
    </>
  )
}

// пока что закоментировано тк не стилизована шапка диалога
// const styles = StyleSheet.create({
//   messageContainer: {
//     // display: 'flex',
//     // flexDirection: 'column-reverse',
//     // alignItems: 'flex-start',
//     // justifyContent: 'flex-start'
//     flex: 1,
//     // width: 500,
//     // height: 500,
//     alignItems: 'flex-start',
//     alignContent: 'flex-start',
//     flexDirection: 'ltr',
//   },
//   message: {
//     // flexGrow: 0,
//     // flexShrink: 0,
//     // flexBasis: 'auto'
//     flex: 1,
//     // width: 100,
//     // height: 100,
//     flexShrink: 0,
//   }
// })
