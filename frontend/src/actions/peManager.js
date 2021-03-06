import fetch from 'isomorphic-fetch';
import * as types from '../constants/peManager';
import config from '../config/config';
import { getHeaders, objToGetParams } from '../helper';
import changeCase from 'change-case';
import objectAssign from 'object-assign';


export function getPeManager(id) {
  return dispatch => {
    let isError = false;
    const returnObj = {
      type: types.PEMANAGER_FETCH_SUCCESS,
      id
    };
    dispatch({ type: types.PEMANAGER_FETCH_START });
    fetch(`${config.baseUrl}/api/pe_manager/pe-managers/?id=${id}`,
      { method: 'GET',
        headers: getHeaders()
      })
      .then(response => {
        if (response.status >= 400) {
          window.localStorage.removeItem('jwt');
          isError = true;
          dispatch(returnObj);
        }
        return response.json();
      })
      .then(json => {
        if (!isError) {
          returnObj.data = json;
          dispatch(returnObj);
        }
      });
  };
}

export function addReview(data, successCallback) {
  return dispatch => {
    let isError = false;
    fetch(`${config.baseUrl}/api/pe_manager/review/`,
      { method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      })
      .then(response => {
        isError = (response.status >= 400);
        return response.json();
      })
      .then((json) => {
        if (!isError) {
          successCallback.apply(null);
          dispatch({ type: types.REVIEW_ADD_SUCCESS, data: { review: json } });
        }
      });
  };
}

export function addRaport(data, successCallback) {
  return dispatch => {
    fetch(`${config.baseUrl}/api/pe_manager/raport/`,
      { method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      })
      .then(() => {
        if (successCallback) {
          successCallback.apply(null);
        }
        dispatch({ type: types.RAPORT_ADD_SUCCESS });
      });
  };
}

export function addThumb(data, successCallback) {
  return dispatch => {
    let isError = false;
    fetch(`${config.baseUrl}/api/pe_manager/thumb/`,
      { method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      })
      .then(response => {
        isError = (response.status >= 400);
        if (!isError) {
          successCallback.apply(null);
          dispatch({ type: types.THUMB_ADD_SUCCESS });
        }
      });
  };
}

export function getReview(id, page, ordering) {
  return dispatch => {
    let isError = false;
    const returnObj = {
      type: types.REVIEW_FETCH_SUCCESS,
      data: { page },
      ordering,
    };
    const paramsObj = objectAssign(
        {}, { ordering: `${changeCase.snakeCase(ordering)}`, page },
    );
    const params = objToGetParams(paramsObj);
    dispatch({ type: types.REVIEW_FETCH_START });
    fetch(`${config.baseUrl}/api/pe_manager/review/${id}/${params}`,
      { method: 'GET',
        headers: getHeaders()
      })
      .then(response => {
        if (response.status === 404) {
          isError = true;
          dispatch({ type: types.REVIEW_FETCH_NO_MORE });
        } else if (response.status >= 400) {
          window.localStorage.removeItem('jwt');
          isError = true;
          dispatch(returnObj);
        }
        return response.json();
      })
      .then(json => {
        if (!isError) {
          returnObj.data = json;
          dispatch(returnObj);
        }
      });
  };
}
