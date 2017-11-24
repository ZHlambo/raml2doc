import {
    combineReducers
} from 'redux'
import {
    routerReducer
} from "react-router-redux"

import authReducer from './reducer/auth'
import catReducer from './reducer/cat'
import skuReducer from './reducer/sku'

export default combineReducers({
    routing:routerReducer,
    authReducer,
    catReducer,
    skuReducer,
})
