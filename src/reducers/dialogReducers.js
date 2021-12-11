import { SAVE_DIALOG } from "../actions/dialogAction";

const initialState = {
  objectDialog: null,
  idDialog: null
}

export function dialogReducer (state = initialState, action) {
  console.log('dialogReducer', action)
  switch (action.type) {
    case SAVE_DIALOG: {
      return state
    }
    default :
      return state
  }
}
