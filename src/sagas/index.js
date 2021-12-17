import { all, call, put, select, takeLatest } from 'redux-saga/effects'
import { firebase } from '@react-native-firebase/database'

export const getDialogState = (state) => state.dialog

const transferedMessages = (msg) => {
  const messages = msg.messages.reverse()
  return messages.map((message, index) => {
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
}

function* getMessages() {
  try {
    const { idDialog } = yield select(getDialogState)

    const _messages = yield call(() => {
      return new Promise((resolve, _) => {
        firebase
          .database()
          .ref('chat/active/')
          .orderByChild('uuid')
          .equalTo(idDialog)
          .once('value', (snapshot) => {
            const tmp = Number(Object.keys(snapshot.val()))
            resolve(snapshot.val()[tmp].messages)
          })
      })
    })

    const newMessages = transferedMessages(_messages)

    yield put({
      type: 'GET_MESSAGES_SUCCESS',
      payload: { messages: newMessages }
    })
  } catch (e) {
    console.log(e)
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest('GET_MESSAGES_REQUEST', getMessages)
  ])
}
