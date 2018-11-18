import {combineReducers, createStore, applyMiddleware} from 'redux'
import thunkMiddleware from 'redux-thunk'

import LoginRegistReducer from '../components/Header/LoginRegistReducer';
import CommentReducer from '../pages/Comment/CommentReducer';

const reducers = combineReducers({ 
	LoginRegistReducer, 
	CommentReducer 
})
const store = createStore(reducers, applyMiddleware(thunkMiddleware));

export default store
