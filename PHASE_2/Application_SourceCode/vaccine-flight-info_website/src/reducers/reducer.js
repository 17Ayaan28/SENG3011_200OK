const add_firebase = (state = {}, action) => {
    switch (action.type) {
      case 'LOG_IN':
        return {
            ...state,
            firebase: action.payload
        }
        //state.firebase = action.payload
      default:
        return state
    }
}

export default add_firebase;