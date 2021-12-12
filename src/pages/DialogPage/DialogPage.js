import React, { useCallback, useEffect, useState } from 'react'
import { View } from 'native-base'
import database from '@react-native-firebase/database'
import { GiftedChat } from 'react-native-gifted-chat'
import { MyAppBar } from '../../components/MyAppBar/MyAppBar'
import { SendComponent } from '../../components/SendComponent/SendComponent'
import { useSelector } from "react-redux";

export const DialogPage = () => {
  const { idDialog } = useSelector((state) => state.dialog)
  const [messages, setMessages] = useState([])

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
    getMessages()
  }, [])

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

  return (
    1 && (
      <View width="100%" height="100%">
        <View width="100%" height="10%">
          <MyAppBar />
        </View>
        <GiftedChat
          messages={messages}
          user={{
            _id: 1
          }}
          renderInputToolbar={() => {
            return <SendComponent onSend={onSend} />
          }}
        />
      </View>
    )
  )
}
