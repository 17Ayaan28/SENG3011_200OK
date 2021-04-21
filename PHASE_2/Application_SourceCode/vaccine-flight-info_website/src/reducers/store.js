import add_firebase from './reducer';
import { createStore } from 'redux'

const store = createStore(add_firebase)

export default store;