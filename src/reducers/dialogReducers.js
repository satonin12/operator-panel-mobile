import {
  DIALOG_START,
  SAVE_DIALOG,
  CLEAR_STATE,
  ADD_IMAGE,
  SEND_MESSAGE,
  GET_MESSAGES_REQUEST,
  GET_MESSAGES_SUCCESS,
  GET_MESSAGES_FAILURE,
  DELETE_IMAGE
} from "../actions/dialogAction";

const initialState = {
  objectDialog: null,
  messages: [],
  attachImage: [],
  idDialog: null,
  isDialogOpen: false,
  loading: false,
  errorLoading: null,
}

export function dialogReducer (state = initialState, action) {
  switch (action.type) {
    case SAVE_DIALOG: {
      return {
        ...state,
        objectDialog: action.payload.dialog,
        idDialog: action.payload.dialog.uuid
      }
    }
    case DIALOG_START: {
      return {
        ...state,
        isDialogOpen: true
      }
    }
    case ADD_IMAGE: {
      return {
        ...state,
        attachImage: [...state.attachImage, action.payload]
      }
    }
    case DELETE_IMAGE: {
      return {
        ...state,
        attachImage: []
      }
    }
    case SEND_MESSAGE: {
      return state
    }
    case GET_MESSAGES_REQUEST: {
      return {
        ...state,
        loading: true,
      }
    }
    case GET_MESSAGES_SUCCESS: {
      return {
        ...state,
        messages: action.payload,
        loading: false,
      }
    }
    case GET_MESSAGES_FAILURE: {
      return {
        ...state,
        errorLoading: action.payload,
        loading: false
      }
    }
    case CLEAR_STATE:
      return initialState
    default :
      return state
  }
}
