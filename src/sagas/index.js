import { takeLatest, all } from 'redux-saga/effects'


function * saveDialogToState (action) {
  console.log('saga', action)
}
export default function * rootSaga () {
  yield all ([
    takeLatest('SAVE_DIALOG', saveDialogToState),
  ])
}
