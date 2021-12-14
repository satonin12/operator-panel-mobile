import React, { useCallback, useEffect, useState } from 'react'
// import { View } from 'native-base'
import database from '@react-native-firebase/database'
import { GiftedChat } from 'react-native-gifted-chat'
// import { MyAppBar } from '../../components/MyAppBar/MyAppBar'
// import { SendComponent } from '../../components/SendComponent/SendComponent'
import { useDispatch, useSelector } from "react-redux";
import { usePubNub } from 'pubnub-react'
import { SafeAreaView } from 'react-native'
import {launchImageLibrary} from 'react-native-image-picker';

import { CameraComponent } from '../../components/CameraComponent/CameraComponent'
import { SendComponent } from "../../components/SendComponent/SendComponent";
import { MyAppBar } from "../../components/MyAppBar/MyAppBar";
import { View } from "native-base";

import {Actions} from 'react-native-router-flux'
import { uploadImageInCloudniary } from "../../utils/sendToCloudinary";

export const DialogPage = (props) => {
  const dispatch = useDispatch()
  
  const { idDialog, objectDialog, attachImage } = useSelector((state) => state.dialog)
  const [messages, setMessages] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  
  // const [channels] = useState([objectDialog.name])
  const pubnub = usePubNub()

  const getMessages = async () => {
    try {
      await database()
        .ref('chat/active/')
        .orderByChild('uuid')
        // .equalTo(idDialog)
        .equalTo(idDialog)
        .once('value')
        .then((snapshot) => {
          const tmp = Number(Object.keys(snapshot.val())[0])
          const messages = snapshot.val()[tmp]
          transferedMessages(messages)
        })
    } catch (e) {
      console.log('error getMessages, ', e)
    }
  }

  const transferedMessages = (msg) => {
    const messages = msg.messages.reverse()
    const newArrayMessages = messages.map((message, index) => {
      return {
        _id: msg.operatorId + index,
        text: message.content,
        createdAt: message.timestamp,
        user: {
          _id: msg.uuid + Date.now(),
          name: msg.name,
          avatar: msg.avatar
        }
      }
    })
    setMessages(newArrayMessages)
  }

  useEffect(() => {
    if(props.url) {
      dispatch({type: 'ADD_IMAGE', payload: props.url})
    }
    // getMessages()
  }, [])

  const handleMessage = (event) => {
    console.log('handleMessage ', event)
  }

  const handleSignal = (event) => {
    if (event.message === 'typing_on') {
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
      }, 3000)
    }
  }

  // useEffect(() => {
  //   pubnub.addListener({
  //     message: handleMessage,
  //     signal: handleSignal
  //   })
  //   pubnub.subscribe({ channels })
  //   // eslint-disable-next-line
  // }, [pubnub, channels])

  const onSend = useCallback((value) => {
    const date = new Date()
    const newMessage = {
      ...messages[0],
      text: value,
      createdAt: date.toISOString()
    }
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessage)
    )
  }, [])
  
  const handlerAddImage = () => {
    Actions.camera()
  }
  
  const handlerSelectImage = async () => {
    const result = await launchImageLibrary({includeBase64: true})
    const base64 = result.assets[0].base64
    const resUploadCloudinary = await uploadImageInCloudniary(base64)
    const response = resUploadCloudinary.json()
    dispatch({type: 'ADD_IMAGE', payload: response.url})
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
              // name: objectDialog.name
            }}
            isTyping={isTyping}
            messages={messages}
            renderInputToolbar={() => {
              return <SendComponent
                attachImage
                onSend={onSend}
                badges={attachImage.length}
                onAddImage={handlerAddImage}
                onSelectImage={handlerSelectImage}
              />
            }}
          />
        </View>
      </SafeAreaView>
    )
  )
}
