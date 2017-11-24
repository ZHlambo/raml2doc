import request from '../request'
import {parseDataSource, updateElement, deleteElement} from 'static/utils'
import {HOST, API_CATS, API_CAT, API_CAT_CHILD, API_CAT_INFO, API_DEL_CAT} from  '../api'

const CATS = "CATS";
const CAT = "CAT";
const CAT_CHILD = "CAT_CHILD";
const DEL_CAT = "DEL_CAT";
const GET_CAT_INFO = "GET_CAT_INFO";
const PUT_CAT_INFO = "PUT_CAT_INFO";


const initState = {
  cats: "",
}

export const getCats = (query) => (dispatch, getState) => {
    query = query || {};
    query.where = query.where || {};
    query.where.deletedAt = {$ne: null};
    dispatch({
        type: CATS,
        payload: {
            promise: request.get(API_CATS,{
              // headers: {Authorization :"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibGFtYm8iLCJ0eXBlIjoibWFuYWdlIiwiaWF0IjoxNTEwNjUyNjAyLCJleHAiOjE1MTA3MzkwMDJ9.vbiYD_1YmCrhLNb81JbR-pQzLf98Mm20oPCD9H-MAQU"},
              query
            })
        }
    })
}

export const createCat = (data, cat) => (dispatch, getState) => {
    dispatch({
        type: CAT,
        payload: {
            promise: request.post(API_CAT,{
              // headers: {Authorization :"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibGFtYm8iLCJ0eXBlIjoibWFuYWdlIiwiaWF0IjoxNTEwNjUyNjAyLCJleHAiOjE1MTA3MzkwMDJ9.vbiYD_1YmCrhLNb81JbR-pQzLf98Mm20oPCD9H-MAQU"},
              data
            }).then(e => {
              e.child = [];
              Object.assign(cat,e);
              return e;
            })
        }
    })
}

export const getCatChild = (id, parentCat) => (dispatch, getState) => {
    let query = {};
    query.where = query.where || {};
    query.where.deletedAt = null;
    dispatch({
        type: CAT_CHILD,
        payload: {
            promise: request.get(API_CAT_CHILD,{
              // headers: {Authorization :"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibGFtYm8iLCJ0eXBlIjoibWFuYWdlIiwiaWF0IjoxNTEwNjUyNjAyLCJleHAiOjE1MTA3MzkwMDJ9.vbiYD_1YmCrhLNb81JbR-pQzLf98Mm20oPCD9H-MAQU"},
              operateId: id,
              query
            }).then(e => {
              parentCat.child = e;
              return e;
            })
        }
    })
}

export const putCatInfo = (id, data) => (dispatch, getState) => {
    dispatch({
        type: GET_CAT_INFO,
        payload: {
            promise: request.put(API_CAT_INFO,{
              // headers: {Authorization :"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibGFtYm8iLCJ0eXBlIjoibWFuYWdlIiwiaWF0IjoxNTEwNjUyNjAyLCJleHAiOjE1MTA3MzkwMDJ9.vbiYD_1YmCrhLNb81JbR-pQzLf98Mm20oPCD9H-MAQU"},
              operateId: id,
              data,
            })
        }
    })
}

export const delCat = (id, parentCats) => (dispatch, getState) => {
    dispatch({
        type: DEL_CAT,
        payload: {
            promise: request.del(API_DEL_CAT,{
              // headers: {Authorization :"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibGFtYm8iLCJ0eXBlIjoibWFuYWdlIiwiaWF0IjoxNTEwNjUyNjAyLCJleHAiOjE1MTA3MzkwMDJ9.vbiYD_1YmCrhLNb81JbR-pQzLf98Mm20oPCD9H-MAQU"},
              operateId: id,
            }).then(e => {
              console.log(deleteElement(parentCats, "id", id));
              return e;
            })
        }
    })
}

export default function catReducer(state = initState, action) {
    switch (action.type) {

      case `${CATS}_PENDING`:
        return {...state, fcCats:true}
      case `${CATS}_REJECTED`:
        return {...state, fcCats:false}
      case `${CATS}_FULFILLED`:
        return {...state, cats: action.payload,fcCats:false}

      // case `${CAT_CHILD}_PENDING`:
      //   return {...state, fcCats:true}
      // case `${CAT_CHILD}_REJECTED`:
      //   return {...state, fcCats:false}
      case `${CAT}_FULFILLED`:
      case `${DEL_CAT}_FULFILLED`:
        // updateElement(state.cats, "id", action.payload);
        return {...state}
      case `${CAT_CHILD}_FULFILLED`:
        return {...state, catChild: action.payload}

      default:
        return {...state}
    }
}
