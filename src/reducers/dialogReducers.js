import { DIALOG_START, SAVE_DIALOG, CLEAR_STATE, ADD_IMAGE } from "../actions/dialogAction";

const initialState = {
  objectDialog: null,
  attachImage: [],
  idDialog: null,
  isDialogOpen: false
}

export function dialogReducer (state = initialState, action) {
  console.log('dialogReducer', action)
  switch (action.type) {
    case SAVE_DIALOG: {
      return {
        ...state,
        objectDialog: {
          ...state.objectDialog,
          ...action.payload
        },
        idDialog: action.payload.uuid,
        isDialogOpen: false
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
    case CLEAR_STATE:
      return initialState
    default :
      return state
  }
}
