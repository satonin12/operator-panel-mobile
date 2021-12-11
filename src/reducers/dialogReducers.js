import { DIALOG_START, SAVE_DIALOG, CLEAR_STATE } from "../actions/dialogAction";

const initialState = {
  objectDialog: null,
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
    case CLEAR_STATE:
      return initialState
    default :
      return state
  }
}
