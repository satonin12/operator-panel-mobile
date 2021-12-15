import React, { useCallback, useEffect, useState } from 'react'
import { usePubNub } from 'pubnub-react'
import {Spinner, View, Image } from 'native-base'
import { Actions } from 'react-native-router-flux'
import { GiftedChat } from 'react-native-gifted-chat'
import { useDispatch, useSelector } from 'react-redux'
import { SafeAreaView, StyleSheet } from 'react-native'
import { launchImageLibrary } from 'react-native-image-picker'
import database, { firebase } from '@react-native-firebase/database'

import { MyAppBar } from '../../components/MyAppBar/MyAppBar'
import { uploadImageInCloudniary } from '../../utils/sendToCloudinary'
import { SendComponent } from '../../components/SendComponent/SendComponent'

// * NOTICE: use if needed animation of new messages
// import * as Animatable from 'react-native-animatable'

export const DialogPage = (props) => {
  const pubnub = usePubNub()
  const dispatch = useDispatch()
  
  console.log('отрендерили DialogPage')
  
  const { idDialog, objectDialog, attachImage, loading } = useSelector((state) => state.dialog)
  
  // ui state's
  const [messages, setMessages] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const [channels] = useState([objectDialog.name])

  // ? Function declaration block
  
  const getMessages = useCallback(async () => {
    console.log('getMessages')
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
      console.log('newDialogSave ', newDialogSave)

      transferredMessages(newDialogSave)
    } catch (e) {
      console.log('error getMessages, ', e)
    }
  }, [])

  const transferredMessages = (msg) => {
    const messages = msg.messages.reverse()
    const newArrayMessages = messages.map((message, index) => {
      const tmpMessageObject = {
        _id: msg.operatorId + index,
        text: message.content,
        createdAt: message.timestamp,
        user: {
          _id: msg.uuid + Date.now(),
          name: msg.name,
          avatar: msg.avatar
        }
      }
      if (message.image_url) {
        tmpMessageObject.image = message.image_url.map((image) => image.src)
      }
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
    console.log('отрендерили DialogPage')
    checkImageProps()
    getMessages()
  }, [])

  const handleMessage = (event) => {
    const date = new Date(event.timetoken / 1e4).toISOString()
    const newMessage = {
      ...messages[0],
      text: event.message.value,
      createdAt: date
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
    if (event.message === 'typing_on') {
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
      console.log('attachImage.length ', attachImage.length)

      const newMessageForGiftedChat = {
        ...messages[0],
        text: value,
        createdAt: date.toISOString()
      }
      const dataMessage = {
        content: value,
        timestamp: date.toISOString(),
        writtenBy: 'client'
      }

      if (attachImage.length !== 0) {
        newMessageForGiftedChat.image = attachImage
        dataMessage.image_url = attachImage
        console.log(newMessageForGiftedChat)
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

  // FIXME: working on first message of list every send message,
  // there are restrictions on attaching pictures and text
  // TODO: message time drop to bottom
  // const renderAnimationBubble = (props) => {
  //   //animation only new messages
  //   // if (props.currentMessage) {
  //   //   return (
  //   //     <Animatable.View animation="fadeInUpBig" duration={400}>
  //   //       <Bubble {...props} />
  //   //     </Animatable.View>
  //   //   )
  //   // }
  //   if (typeof props.currentMessage.image !== 'undefined') {
  //     if(props.currentMessage.image.length >= 1 && props.currentMessage.text.trim().length) {
  //       const images = props.currentMessage.image
  //       return (
  //         <View style={styles.container}>
  //           <Bubble {...props} />
  //           {images.map((image, index) => {
  //             if (typeof image !== 'undefined') {
  //               return (
  //                 <Image
  //                   key={image + index + Date.now()}
  //                   style={styles.image}
  //                   alt="Image for dialog"
  //                   source={{ uri: image }}
  //                   ignoreFallback={false}
  //                   fallbackSource={{
  //                     uri: require('../../assets/image404.jpg'),
  //                   }}
  //                 />
  //               )
  //             } else {
  //               props.currentMessage.image = null
  //               return <Bubble key={index + Date.now()} {...props} />
  //             }
  //           })}
  //         </View>
  //       )
  //     }
  //   }
  //   props.currentMessage.image = null
  //   return <Bubble {...props} />
  // }

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

  return (
    1 && (
      <SafeAreaView styles={{ flex: 1 }}>
        <View width="100%" height="100%">
          <View width="100%" height="10%">
            <MyAppBar />
          </View>
          <GiftedChat
            user={{
              _id: 1,
              name: objectDialog.name
            }}
            isTyping={isTyping}
            messages={messages}
            // renderBubble={renderAnimationBubble}
            renderMessageImage={renderMessageImage}
            renderLoading={renderLoading}
            renderInputToolbar={() => {
              return (
                <SendComponent
                  attachImage
                  onSend={onSend}
                  badges={attachImage.length}
                  onAddImage={handlerAddImage}
                  onSelectImage={handlerSelectImage}
                />
              )
            }}
          />
        </View>
      </SafeAreaView>
    )
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
