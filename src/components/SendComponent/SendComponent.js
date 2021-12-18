import React, { useState } from 'react'
import {
  AddIcon,
  ArrowForwardIcon,
  Box,
  Flex,
  Input,
  Popover,
  Image,
  HStack,
  VStack,
  Badge
} from 'native-base'
import PropTypes from 'prop-types'
import { TouchableHighlight } from 'react-native'

export const SendComponent = ({
  onSend,
  onAddImage,
  onSelectImage,
  badges,
                                onInputChange
}) => {
  const [value, setValue] = useState('')

  const handlerSend = () => {
    onSend(value)
    setValue('')
  }
  
  const handlerChangeText = (value) => {
    setValue(value)
    onInputChange()
  }

  return (
    <>
      <Box width="100%" height="10%" flex="1" safeAreaTop>
        <Flex
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Popover
            placement="top right"
            trigger={(triggerProps) => {
              return badges !== 0 ? (
                <VStack>
                  <Badge
                    mb={-1}
                    mr={-3}
                    zIndex={1}
                    rounded="999px"
                    variant="solid"
                    colorScheme="danger"
                    alignSelf="flex-end"
                    _text={{
                      fontSize: 6
                    }}
                  >
                    {badges}
                  </Badge>
                  <AddIcon width="10%" size="4" ml="2" {...triggerProps} />
                </VStack>
              ) : (
                <AddIcon width="10%" size="4" ml="2" {...triggerProps} />
              )
            }}
          >
            <Popover.Content w="56">
              <Popover.Arrow />
              <Popover.CloseButton />
              <Popover.Header>Выберите действие</Popover.Header>
              <Popover.Body alignItems="center">
                <HStack space={10} alignItems="center">
                  <TouchableHighlight onPress={onAddImage}>
                    <Image
                      size="xs"
                      alt="Alternate Text"
                      source={require('../../assets/camera.jpg')}
                    />
                  </TouchableHighlight>

                  <TouchableHighlight onPress={onSelectImage}>
                    <Image
                      size="xs"
                      alt="Alternate Text"
                      source={require('../../assets/image.jpg')}
                    />
                  </TouchableHighlight>
                </HStack>
              </Popover.Body>
            </Popover.Content>
          </Popover>
          <Input
            width="80%"
            value={value}
            variant="filled"
            placeholder="Напишите собщение..."
            onChangeText={handlerChangeText}
          />
          <ArrowForwardIcon mr="3" size="6" width="10%" onPress={handlerSend} />
        </Flex>
      </Box>
    </>
  )
}

SendComponent.propTypes = {
  onSend: PropTypes.func,
  onAddImage: PropTypes.func,
  onSelectImage: PropTypes.func,
  badges: PropTypes.number
}
