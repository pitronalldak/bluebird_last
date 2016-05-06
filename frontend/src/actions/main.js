import fetch from 'isomorphic-fetch';
import * as types from '../constants/main';
import objectAssign from 'object-assign';
import config from '../config/config';
import { getHeaders, objToGetParams } from '../helper';
import changeCase from 'change-case';


export function getPeManagers(page, ordering, sort, direction, search, filters) {
  return dispatch => {
    let isError = false;
    const returnObj = {
      type: types.PEMANAGER_FETCH_SUCCESS,
      data: { page },
      sort, ordering,
      search
    };
    const paramsObj = objectAssign(
        {}, { ordering: `${direction}${changeCase.snakeCase(ordering)}`, page, search },
        filters
    );
    const params = objToGetParams(paramsObj);
    dispatch({ type: types.PEMANAGER_FETCH_START });
    fetch(`${config.baseUrl}/api/pe_manager/pe-managers/${params}`,
      { method: 'GET',
        headers: getHeaders()
      })
      .then(response => {
        if (response.status === 404) {
          isError = true;
          dispatch({ type: types.PEMANAGER_FETCH_NO_MORE });
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
          returnObj.filters = filters;
          dispatch(returnObj);
        }
      });
  };
}

export function addPeManager(data, successCallback) {
  return dispatch => {
    let isError = false;
    const isEdit = data.id;
    fetch(`${config.baseUrl}/api/admin/pe-managers/`,
      { method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      })
      .then(response => {
        isError = (response.status >= 400);
        return response.json();
      })
      .then(json => {
        if (isError) {
          dispatch({ type: types.PEMANAGER_ADD_ERROR, data: { peManagerErrors: json } });
        } else if (successCallback) {
          successCallback.apply(null);
        }
        dispatch({ type: types.PEMANAGER_ADD_SUCCESS, data: { isEdit, peManager: json } });
      });
  };
}
