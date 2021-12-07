import React from 'react'
import type { Node } from 'react'
import * as Sentry from '@sentry/react-native'

import {
  NativeBaseProvider
} from 'native-base';
import AppRouter from "./router/AppRouter";


Sentry.init({
  dsn: 'https://19cdb36b586d4e97bb1ae5046ff65564@o1085610.ingest.sentry.io/6096605',
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production.
  tracesSampleRate: 1.0
})

const App: () => Node = () => {
  return (
    <NativeBaseProvider>
      <AppRouter/>
    </NativeBaseProvider>
  )
}

Sentry.wrap(App)
export default App
