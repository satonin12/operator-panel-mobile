import React from 'react'
import { Router, Stack, Scene } from 'react-native-router-flux'
import type { Node } from 'react'
import { Routes } from './index'
import { useSelector } from 'react-redux'
import { DialogPage } from "../pages/DialogPage/DialogPage";

const AppRouter: () => Node = () => {
  const { isDialogOpen } = useSelector((state) => state.dialog)
  
  return isDialogOpen ? (
    <Router>
      <Stack key="root">
          <Scene
            back={false}
            key='dialog'
            title='Диалог'
            component={DialogPage}
          />
      </Stack>
    </Router>
  ) : (
    <Router>
      <Stack key="root">
        {Routes.map((route) => (
          <Scene
            key={route.key}
            component={route.component}
            title={route?.title}
            back={route?.back}
            initial={route?.initial}
          />
        ))}
      </Stack>
    </Router>
  )
}

export default AppRouter
