import React from 'react'
import type { Node } from 'react'
// import * as Sentry from '@sentry/react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';

import { NativeBaseProvider } from 'native-base'
import { persistReducer, persistStore } from 'redux-persist'
import createSagaMiddleware from 'redux-saga'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import { composeWithDevTools } from 'remote-redux-devtools';
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import { dialogReducer } from './reducers/dialogReducers'
import AppRouter from './router/AppRouter'
import rootSaga from "./sagas";

// TODO: добавить переменные среды
//  запускать только при NODE_ENV==='production'
// Sentry.init({
//   dsn: 'https://19cdb36b586d4e97bb1ae5046ff65564@o1085610.ingest.sentry.io/6096605',
//   // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
//   // We recommend adjusting this value in production.
//   tracesSampleRate: 1.0
// })

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
const composeEnhancers = composeWithDevTools({ realtime: true, port: 8081 });
const store = createStore(
  pReducer,
  composeEnhancers(applyMiddleware(sagaMiddleware),
  ));

const persistor = persistStore(store)

// run the saga
sagaMiddleware.run(rootSaga)

const App: () => Node = () => {
  return (
    // <React.StrictMode>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <NativeBaseProvider>
            <AppRouter />
          </NativeBaseProvider>
        </PersistGate>
      </Provider>
    // </React.StrictMode>
  )
}

// Sentry.wrap(App)
export default App
