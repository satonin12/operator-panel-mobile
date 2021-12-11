import { HomePage } from '../pages/HomePage/HomePage'
import { QueuePage } from '../pages/QueuePage/QueuePage'
import { DialogPage } from "../pages/DialogPage/DialogPage";

export const Routes = [
  {
    key: 'home',
    title: 'Начальный экран',
    component: HomePage
  },
  {
    key: 'queue',
    title: 'Очередь',
    component: QueuePage
  },
  {
    key: 'dialog',
    title: 'Диалог',
    component: DialogPage
  }
]
