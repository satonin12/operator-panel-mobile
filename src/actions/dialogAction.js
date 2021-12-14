export const SAVE_DIALOG = 'SAVE_DIALOG'
export const DIALOG_START = 'DIALOG_START'

export const ADD_IMAGE = 'ADD_IMAGE'

export const CLEAR_STATE = 'CLEAR_STATE'

export function saveDialog () {
  return {
    type: SAVE_DIALOG
  }
}
export function dialogStart () {
  return {
    type: DIALOG_START
  }
}

export function addImage () {
  return {
    type: ADD_IMAGE
  }
}

export function clearState () {
  return {
    type: CLEAR_STATE
  }
}
