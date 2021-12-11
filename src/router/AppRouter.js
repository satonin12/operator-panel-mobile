import React from 'react'
import { Router, Stack, Scene } from 'react-native-router-flux'
import type { Node } from 'react'
import { Routes } from './index'

const AppRouter: () => Node = () => {
  return (
  <Router>
    <Stack key="root">
      {Routes.map((route) => (
        <Scene key={route.key} component={route.component} title={route.title} back={route?.back} />
      ))}
    </Stack>
  </Router>
  )
}

export default AppRouter
