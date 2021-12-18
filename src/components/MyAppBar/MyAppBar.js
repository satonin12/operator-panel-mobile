import React from 'react'
import { Box, Button, Flex, Image, Text } from 'native-base'
import PropTypes from 'prop-types'
import { TouchableHighlight } from 'react-native'

export const MyAppBar = ({ operator, handlerExit }) => {
  return (
    <Box width="100%" height="10%" flex="1" safeAreaTop>
      <Flex
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        paddingTop={2}
      >
        {'avatar' in operator && (
          <Image
            ml={3}
            size={38}
            borderRadius={100}
            alt="Avatar of operator"
            source={{ uri: operator.avatar }}
            fallbackSource={{
              uri: require('../../assets/avatar_icon.svg')
            }}
          />
        )}
        <Text fontSize="xl" px="3" bold>
          {operator.name || operator.email}
        </Text>
        <TouchableHighlight width="30%" height="100%">
          <Button
            mr={2}
            height="85%"
            variant="subtle"
            colorScheme="secondary"
            style={{ fontSize: 6 }}
            onPress={handlerExit}
          >
            Завершить
          </Button>
        </TouchableHighlight>
      </Flex>
    </Box>
  )
}

MyAppBar.propTypes = {
  operator: PropTypes.object,
  handlerExit: PropTypes.func
}
