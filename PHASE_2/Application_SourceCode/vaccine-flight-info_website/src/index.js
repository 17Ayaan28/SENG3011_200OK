import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { FirebaseContext } from './components/Firebase';
//import { createStore } from 'redux';
import { Provider } from 'react-redux';
import store from './reducers/store';
import Firebase from './components/Firebase/firebase'
//import rootReducer from './reducers'

ReactDOM.render(
        <FirebaseContext.Provider value={Firebase}>
             <Provider store={store}>
                <App />
             </Provider>
        </FirebaseContext.Provider>,
    document.getElementById('root')
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
