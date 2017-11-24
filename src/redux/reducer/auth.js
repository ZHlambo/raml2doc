import request from '../request'
import {host} from  '../api'

const GET_URL = "GET_URL"


const initState = {
    name: 'Drod'
}

export const getUrl = () => (dispatch, getState) => {
    dispatch({
        type: GET_URL,
        payload: {
            promise: request.get(host)
        }
    })
}

export default function authReducer(state = initState, action) {
    switch (action.type) {
      case `${GET_URL}_PENDING`:
        return {...state,data:action.payload}
      case `${GET_URL}_FULFILLED`:
        return {...state,data:action.payload}
      case `${GET_URL}_REJECT`:
        return {...state,data:action.payload}

        default:
          return {...state}
    }
}
