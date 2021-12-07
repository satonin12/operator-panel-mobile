import React from 'react'
import {
  Input,
  Stack,
  FormControl,
  Box,
  Select,
  VStack,
  CheckIcon,
  Button
} from 'native-base'

export const StartForm = () => {
  return (
    <Box>
      <FormControl>
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
              <Select.Item label="Ошибка" value="ux" />
              <Select.Item label="Обращение" value="web" />
              <Select.Item label="Подсказка" value="cross" />
              <Select.Item label="Обращение" value="ui" />
              <Select.Item label="Вопрос" value="backend" />
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
              <Select.Item label="Система" value="ux" />
              <Select.Item label="Ошибка" value="web" />
              <Select.Item label="Личный кабинет" value="cross" />
              <Select.Item label="Авторизация" value="ui" />
              <Select.Item label="Косметическое несоответсвие" value="backend" />
            </Select>
          </VStack>
          
          <Button onPress={() => console.log('hello world')}>Войти в чат</Button>
        </Stack>
      </FormControl>
    </Box>
  )
}
