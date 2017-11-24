import request from '../request'
import {parseDataSource, updateElement, deleteElement} from 'static/utils'
import {HOST, API_SKUS, API_SKU, API_SKU_INFO, API_DEL_SKU} from '../api'

const SKUS = "SKUS";
const SKU = "SKU";
const GET_SKU_INFO = "GET_SKU_INFO";
const PUT_SKU_INFO = "PUT_SKU_INFO";
const DEL_SKU = "DEL_SKU";

const initState = {
  skus: []
}

export const getSkus = (query) => (dispatch, getState) => {
  query = query || {};
  query.order = [["id","DESC"]]
  getState().skuReducer.skusFilter = query || {};
  dispatch({
    type: SKUS,
    payload: {
      promise: request.get(API_SKUS, {query})
    }
  })
}

export const createSku = (data) => (dispatch, getState) => {
  dispatch({
    type: SKU,
    payload: {
      promise: request.post(API_SKU, {data})
    }
  })
}

export const putSkuInfo = (id, data) => (dispatch, getState) => {
  dispatch({
    type: GET_SKU_INFO,
    payload: {
      promise: request.put(API_SKU_INFO, {
        operateId: id,
        data
      })
    }
  })
}

export const delSku = (id, parentSkus) => (dispatch, getState) => {
  dispatch({
    type: DEL_SKU,
    payload: {
      promise: request.del(API_DEL_SKU, {operateId: id}).then(e => {
        console.log(deleteElement(parentSkus, "id", id));
        return e;
      })
    }
  })
}

export default function skuReducer(state = initState, action) {
  switch (action.type) {

    case `${SKUS}_PENDING`:
      return {
        ...state,
        fcSkus: true
      }
    case `${SKUS}_REJECTED`:
      return {
        ...state,
        fcSkus: false
      }
    case `${SKUS}_FULFILLED`:
      return {
        ...parseDataSource(state, action.payload, "skus"),
        fcSkus: false
      }

    case `${SKU}_FULFILLED`:
    case `${DEL_SKU}_FULFILLED`:
      return {
        ...state
      }

    default:
      return {
        ...state
      }
  }
}
