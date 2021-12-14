import React from 'react'
import { Router, Stack, Scene } from 'react-native-router-flux'
import type { Node } from 'react'
import { Routes } from './index'
import { useSelector } from 'react-redux'

const AppRouter: () => Node = () => {
  const { isDialogOpen, idDialog } = useSelector((state) => state.dialog)

  console.log('isDialogOpen ', isDialogOpen)
  console.log('idDialog ', idDialog)
  console.log('idDialog ', idDialog !== null)

  // if (isDialogOpen && idDialog !== null) {
    console.log('вернули экран dialog')
    return (
      <Router>
        <Stack key="root">
          <Scene
            key={Routes.dialog?.key}
            back={Routes.dialog?.back}
            title={Routes.dialog?.title}
            initial={Routes.dialog?.initial}
            component={Routes.dialog?.component}
          />
          <Scene
            key={Routes.camera?.key}
            back={Routes.camera?.back}
            title={Routes.camera?.title}
            initial={Routes.camera?.initial}
            component={Routes.camera?.component}
          />
        </Stack>
      </Router>
    )
  // }

  // if (!isDialogOpen && idDialog !== null) {
  //   console.log('вернули экран очереди')
  //   return (
  //     <Router>
  //       <Stack key="root">
  //         <Scene
  //           key={Routes.queue?.key}
  //           back={Routes.queue?.back}
  //           title={Routes.queue?.title}
  //           initial={Routes.queue?.initial}
  //           component={Routes.queue?.component}
  //         />
  //       </Stack>
  //     </Router>
  //   )
  // }
  //
  // if (!isDialogOpen) {
  //   console.log('вернули экран home')
  //   return (
  //     <Router>
  //       <Stack key="root">
  //         <Scene
  //           key={Routes.home?.key}
  //           back={Routes.home?.back}
  //           title={Routes.home?.title}
  //           initial={Routes.home?.initial}
  //           component={Routes.home?.component}
  //         />
  //       </Stack>
  //     </Router>
  //   )
  // }
}

export default AppRouter
