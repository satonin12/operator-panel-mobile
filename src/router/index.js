import { HomePage } from '../pages/HomePage/HomePage'
import { QueuePage } from '../pages/QueuePage/QueuePage'
import { DialogPage } from '../pages/DialogPage/DialogPage'
import { CameraComponent } from "../components/CameraComponent/CameraComponent";

export const Routes = {
  home: {
    key: 'home',
    title: 'Начальный экран',
    component: HomePage,
    initial: true
  },
  queue: {
    key: 'queue',
    title: 'Очередь',
    component: QueuePage
  },
  dialog: {
    key: 'dialog',
    title: 'Диалог',
    component: DialogPage
  },
  camera: {
    key: 'camera',
    title: 'Камеры',
    component: CameraComponent
  }
}
