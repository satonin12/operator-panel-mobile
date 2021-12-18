import React, { useCallback, useEffect, useState } from 'react'
import { usePubNub } from 'pubnub-react'
import { Spinner, View, Image, Modal, Button, Stack } from 'native-base'
import uuid from 'react-native-uuid'
import { Actions } from 'react-native-router-flux'
import { GiftedChat } from 'react-native-gifted-chat'
import { useDispatch, useSelector } from 'react-redux'
import { SafeAreaView, StyleSheet } from 'react-native'
import { AirbnbRating } from 'react-native-ratings'
import { launchImageLibrary } from 'react-native-image-picker'
import database, { firebase } from '@react-native-firebase/database'

import { MyAppBar } from '../../components/MyAppBar/MyAppBar'
import { uploadImageInCloudniary } from '../../utils/sendToCloudinary'
import { SendComponent } from '../../components/SendComponent/SendComponent'
import PropTypes from "prop-types";

// * NOTICE: use if needed animation of new messages
// import * as Animatable from 'react-native-animatable'

export const DialogPage = (props) => {
  const pubnub = usePubNub()
  const dispatch = useDispatch()

  const { idDialog, objectDialog, attachImage, loading } = useSelector(
    (state) => state.dialog
  )

  // ui state's
  const [messages, setMessages] = useState([])
  const [operator, setOperator] = useState({})
  const [loadingOperator, setLoadingOperator] = useState(false)
  const [raitings, setRaitings] = useState(4) // default raitings
  const [isOpenEndDialogWindow, setIsOpenEndDialogWindow] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [channels] = useState([idDialog])

  // ? Function declaration block

  const getMessages = async () => {
    setLoadingOperator(true)
    try {
      let newDialogSave = null
      await database()
        .ref('chat/active')
        .orderByChild('uuid')
        .equalTo(idDialog)
        .once('value')
        .then((snapshot) => {
          const tmp = Number(Object.keys(snapshot.val())[0])
          newDialogSave = snapshot.val()[tmp]
        })

      transferredMessages(newDialogSave)
    } catch (e) {
      throw new Error({
        ...e,
        path: 'DialogPage-getMessages'
      })
    }
  }

  const getOperator = async () => {
    try {
      await database()
        .ref('operators/')
        .orderByChild('uid')
        .equalTo(objectDialog.operatorId)
        .once('value')
        .then((snapshot) => {
          const tmp = Object.keys(snapshot.val())[0]
          const { avatar, name, email, uid } = snapshot.val()[tmp]

          setOperator((prevState) => ({
            ...prevState,
            avatar,
            name,
            email,
            uid
          }))
        })
      setLoadingOperator(false)
    } catch (e) {
      throw new Error({
        ...e,
        path: 'DialogPage-getOperator'
      })
    }
  }

  const transferredMessages = (msg) => {
    const messages = msg.messages.reverse()
    const newArrayMessages = messages.map((message) => {
      const tmpMessageObject = {
        _id: uuid.v4(),
        text: message.content,
        createdAt: message.timestamp
      }
      if (message.writtenBy === 'client') {
        tmpMessageObject.user = {
          _id: idDialog,
          name: objectDialog.name
        }
      }
      if (message.writtenBy === 'operator') {
        tmpMessageObject.user = {
          _id: operator.uid,
          name: operator.name || operator.email,
          avatar: operator.avatar
        }
      }
      if (message.image_url)
        tmpMessageObject.image = message.image_url.map((image) =>
          image.hasOwnProperty('src') ? image.src : image
        )
      return tmpMessageObject
    })
    setMessages(newArrayMessages)
  }

  const checkImageProps = () => {
    if (props.url) {
      dispatch({ type: 'ADD_IMAGE', payload: props.url })
    }
  }

  useEffect(() => {
    checkImageProps()
    getMessages()
    getOperator()
  }, [])

  const handleMessage = (event) => {
    const date = new Date(event.timetoken / 1e4).toISOString()
    const newMessage = {
      _id: uuid.v4(),
      text: event.message.value,
      createdAt: date,
      user: {
        _id: operator.uid,
        name: operator.name || operator.email,
        avatar: operator.avatar
      }
    }
    if (event.message.isImage) {
      newMessage.image = event.message.images.map((image) =>
        image.hasOwnProperty('src') ? image.src : image
      )
    }
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessage)
    )
  }

  const handleSignal = (event) => {
    if (event.message === 'typing_on_operator') {
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
      }, 5000)
    }
  }

  useEffect(() => {
    pubnub.addListener({
      message: handleMessage,
      signal: handleSignal
    })
    pubnub.subscribe({ channels })
    // eslint-disable-next-line
  }, [pubnub, channels])

  const onSend = useCallback(async (value) => {
    if (value.trim().length || attachImage.length !== 0) {
      const date = new Date()
      const newMessageForGiftedChat = {
        _id: uuid.v4(),
        text: value,
        createdAt: date.toISOString(),
        user: {
          _id: idDialog,
          name: objectDialog.name
        }
      }
      const dataMessage = {
        content: value,
        timestamp: date.toISOString(),
        writtenBy: 'client'
      }

      if (attachImage.length !== 0) {
        newMessageForGiftedChat.image = attachImage
        dataMessage.image_url = attachImage
      }

      // save in firebase
      await firebase
        .database()
        .ref('chat/active')
        .orderByChild('uuid')
        .equalTo(idDialog)
        .once('value', (snapshot) => {
          const tmp = Number(Object.keys(snapshot.val()))
          const msg = snapshot.val()[tmp].messages
          snapshot.forEach((child) => {
            child.ref.set({
              ...objectDialog,
              messages: [...msg, dataMessage]
            })
          })
        })

      // save in GiftedChat
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, newMessageForGiftedChat)
      )

      // clear attachImage
      dispatch({ type: 'DELETE_IMAGE' })
    }
  }, [])

  const handlerAddImage = () => {
    Actions.camera()
  }

  const handlerSelectImage = async () => {
    const result = await launchImageLibrary({ includeBase64: true })
    const base64 = result.assets[0].base64
    const resUploadCloudinary = await uploadImageInCloudniary(base64)
    const response = resUploadCloudinary.json()
    dispatch({ type: 'ADD_IMAGE', payload: response.url })
  }

  const handlerExitDialog = () => {
    // change state to open modal window
    setIsOpenEndDialogWindow(true)
  }

  const tranferDialogToComplete = async () => {
    let _newDialogObject = null
    let completeDialogsLength = null
    await database()
      .ref('chat/active')
      .orderByChild('uuid')
      .equalTo(idDialog)
      .once('value')
      .then((snapshot) => {
        snapshot.forEach((child) => {
          // изменяем сам обьект и сохраняем его по прежнему пути
          _newDialogObject = JSON.parse(JSON.stringify(child))
          _newDialogObject.rate = raitings
          _newDialogObject.status = 'complete'

          // удаляем старый диалог в пути chat/active
          child.ref.remove()
        })
      })

    // узнаем длину последнего элемента в firebase chat/complete
    await database()
      .ref('chat/complete/')
      .limitToLast(1)
      .once('value', (snapshot) => {
        const lengthDialogs = Object.keys(snapshot.val())
        completeDialogsLength =
          Number(lengthDialogs[lengthDialogs.length - 1]) + 1
      })

    // создаем новый диалог в пути chat/complete
    await database()
      .ref(`chat/complete/${completeDialogsLength}`)
      .set(_newDialogObject)
  }

  const handlerEndDialog = () => {
    // отправляем в firebase rating и переводим диалог в complete
    tranferDialogToComplete()
    dispatch({ type: 'CLEAR_STATE' })
  }

  // FIXME: working on first message of list every send message,
  // there are restrictions on attaching pictures and text
  // TODO: message time drop to bottom
  /*
  const renderAnimationBubble = (props) => {
    //animation only new messages
    if (props.currentMessage)
      return (
        <Animatable.View animation="fadeInUpBig" duration={400}>
          <Bubble {...props} />
        </Animatable.View>
      )

    if (typeof props.currentMessage.image !== 'undefined') {
      if (
        props.currentMessage.image.length >= 1 &&
        props.currentMessage.text.trim().length
      ) {
        const images = props.currentMessage.image
        return (
          <View style={styles.container}>
            <Bubble {...props} />
            {images.map((image, index) => {
              if (typeof image !== 'undefined') {
                return (
                  <Image
                    key={image + index + Date.now()}
                    style={styles.image}
                    alt="Image for dialog"
                    source={{ uri: image }}
                    ignoreFallback={false}
                    fallbackSource={{
                      uri: require('../../assets/image404.jpg')
                    }}
                  />
                )
              } else {
                props.currentMessage.image = null
                return <Bubble key={index + Date.now()} {...props} />
              }
            })}
          </View>
        )
      }
    }
    props.currentMessage.image = null
    return <Bubble {...props} />
  }
   */

  const renderMessageImage = ({ lightboxProps, imageProps, ...props }) => {
    return (
      <View style={styles.container}>
        {props.currentMessage.image.map((image, index) => (
          <Image
            key={image + index + Date.now()}
            {...imageProps}
            style={styles.image}
            source={{ uri: image }}
            alt="Image for dialog"
          />
        ))}
      </View>
    )
  }

  const renderLoading = () => {
    if (loading) {
      return (
        <Spinner alignItems="center" textAlign="center" color="emerald.500" />
      )
    }
  }

  const ratingCompleted = (rating) => {
    setRaitings(rating)
  }

  const handlerInputChange = (_) => {
    pubnub.signal({
      message: 'typing_on_client',
      channel: channels
    })
  }

  return (
    <SafeAreaView styles={{ flex: 1 }}>
      <View width="100%" height="100%">
        {loadingOperator ? (
          <Spinner color="indigo.500" />
        ) : (
          <>
            <View width="100%" height="10%">
              <MyAppBar operator={operator} handlerExit={handlerExitDialog} />
            </View>
            <GiftedChat
              isTyping={isTyping}
              messages={messages}
              renderLoading={renderLoading}
              renderMessageImage={renderMessageImage}
              // renderBubble={renderAnimationBubble}
              renderInputToolbar={() => {
                return (
                  <SendComponent
                    attachImage
                    onSend={onSend}
                    badges={attachImage.length}
                    onAddImage={handlerAddImage}
                    onSelectImage={handlerSelectImage}
                    onInputChange={handlerInputChange}
                  />
                )
              }}
            />
            <Modal
              isOpen={isOpenEndDialogWindow}
              onClose={() => setIsOpenEndDialogWindow(false)}
            >
              <Modal.Content maxWidth="400px">
                <Modal.CloseButton />
                <Modal.Header>Поставьте оценку оператору</Modal.Header>
                <Modal.Body>
                  <AirbnbRating
                    onFinishRating={ratingCompleted}
                    defaultRating={raitings}
                  />
                </Modal.Body>
                <Modal.Footer>
                  <Stack
                    direction={{
                      base: 'column',
                      md: 'row'
                    }}
                    space={2}
                    mx={{
                      base: 'auto',
                      md: '0'
                    }}
                  >
                    <Button
                      variant="subtle"
                      colorScheme="secondary"
                      onPress={handlerEndDialog}
                    >
                      Отправить оценку
                    </Button>
                  </Stack>
                </Modal.Footer>
              </Modal.Content>
            </Modal>
          </>
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {},
  image: {
    width: 150,
    height: 100,
    borderRadius: 13,
    margin: 3,
    resizeMode: 'cover'
  },
  imageActive: {
    flex: 1,
    resizeMode: 'contain'
  }
})

DialogPage.propTypes = {
  props: PropTypes.object
}
