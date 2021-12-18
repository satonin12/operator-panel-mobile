import React from 'react'
import PubNub from 'pubnub'
import type { Node } from 'react'
import { Provider } from 'react-redux'
import createSagaMiddleware from 'redux-saga'
import { PubNubProvider } from 'pubnub-react'
import { NativeBaseProvider } from 'native-base'
import { composeWithDevTools } from 'remote-redux-devtools'
import { persistReducer, persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createStore, applyMiddleware, combineReducers } from 'redux'

import { dialogReducer } from './reducers/dialogReducers'
import AppRouter from './router/AppRouter'
import rootSaga from './sagas'

// * NOTICE: use only production
import { LogBox } from "react-native";
import * as Sentry from '@sentry/react-native'

const pubnub = new PubNub({
  publishKey: 'pub-c-4d7ac2be-7395-4fa7-a74d-f5b7efa8e439',
  subscribeKey: 'sub-c-000c0078-5349-11ec-8a85-9eadcf5c6378',
  uuid: 'sub-c-000c0078-5349-11ec-8a85-9eadcf5c6378'
})

//  запускать только при NODE_ENV==='production'
Sentry.init({
  dsn: 'https://19cdb36b586d4e97bb1ae5046ff65564@o1085610.ingest.sentry.io/6096605',
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production.
  tracesSampleRate: 1.0
})

// create the persist Config
const rootPersistConfig = {
  key: 'root',
  storage: AsyncStorage
}

const dialogPersistConfig = {
  key: 'dialog',
  storage: AsyncStorage
}

const rootReducer = combineReducers({
  dialog: persistReducer(dialogPersistConfig, dialogReducer)
})

// wrap our main reducer in persist
const pReducer = persistReducer(rootPersistConfig, rootReducer)

// create the saga middleware
const sagaMiddleware = createSagaMiddleware()

// create a redux store with our reducer above and middleware
// const composeEnhancers = composeWithDevTools({ realtime: true, port: 8081 });
const store = createStore(
  pReducer,
  composeWithDevTools(applyMiddleware(sagaMiddleware))
)

const persistor = persistStore(store)

// run the saga
sagaMiddleware.run(rootSaga)

// console.disableYellowBox = true;
// LogBox.ignoreLogs(['WARN', 'Deprecation', 'Require', 'NativeEventEmitter', 'SocketProtocolError', 'EventEmitter', '[SocketProtocolError: Socket hung up]']); // Ignore log notification by message
LogBox.ignoreAllLogs()

const App: () => Node = () => {
  return (
    <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PubNubProvider client={pubnub}>
          <NativeBaseProvider>
            <AppRouter />
          </NativeBaseProvider>
        </PubNubProvider>
      </PersistGate>
    </Provider>
    </React.StrictMode>
  )
}

Sentry.wrap(App)
export default App
