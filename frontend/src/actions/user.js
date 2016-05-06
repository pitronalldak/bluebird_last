import fetch from 'isomorphic-fetch';
import * as types from '../constants/user';
import config from '../config/config';
import { getHeaders, objToGetParams } from '../helper';
import changeCase from 'change-case';
import objectAssign from 'object-assign';


export function getUser(id) {
  return dispatch => {
    let isError = false;
    const returnObj = {
      type: types.USER_FETCH_SUCCESS,
      id
    };
    dispatch({ type: types.USER_FETCH_START });
    fetch(`${config.baseUrl}/api/auth/user/?id=${id}`,
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
    fetch(`${config.baseUrl}/api/pe_manager/user-review/${id}/${params}`,
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
