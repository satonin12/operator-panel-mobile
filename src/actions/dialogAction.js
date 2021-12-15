export const SAVE_DIALOG = 'SAVE_DIALOG'
export const DIALOG_START = 'DIALOG_START'

export const ADD_IMAGE = 'ADD_IMAGE'
export const DELETE_IMAGE = 'DELETE_IMAGE'
export const SEND_MESSAGE = 'SEND_MESSAGE'

export const GET_MESSAGES_REQUEST = 'GET_MESSAGES_REQUEST'
export const GET_MESSAGES_SUCCESS = 'GET_MESSAGES_SUCCESS'
export const GET_MESSAGES_FAILURE = 'GET_MESSAGES_FAILURE'

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
export function deleteImage () {
  return {
    type: ADD_IMAGE
  }
}
export function sendMessage () {
  return {
    type: SEND_MESSAGE
  }
}

export function getMessagesRequest () {
  return {
    type: GET_MESSAGES_REQUEST
  }
}
export function getMessagesSuccess () {
  return {
    type: GET_MESSAGES_SUCCESS
  }
}
export function getMessagesFailure () {
  return {
    type: GET_MESSAGES_FAILURE
  }
}

export function clearState () {
  return {
    type: CLEAR_STATE
  }
}
