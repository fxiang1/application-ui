/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
/*
 * action types
 *
 * action name: <NOUN>_<VERB>
 */

export * from '../reducers/reducerAppDeployments'
export * from '../reducers/reducerAppOverview'

export const CLEAR_REQUEST_STATUS = 'CLEAR_REQUEST_STATUS'

export const DEL_RECEIVE_FAILURE = 'DEL_RECEIVE_FAILURE'
export const DEL_RECEIVE_SUCCESS = 'DEL_RECEIVE_SUCCESS'
export const DEL_REQUEST = 'DEL_REQUEST'

export const MODAL_UPDATE = 'MODAL_UPDATE'

export const POST_RECEIVE_FAILURE = 'POST_RECEIVE_FAILURE'
export const POST_RECEIVE_SUCCESS = 'POST_RECEIVE_SUCCESS'
export const POST_REQUEST = 'POST_REQUEST'
export const PUT_RECEIVE_FAILURE = 'PUT_RECEIVE_FAILURE'
export const PUT_RECEIVE_SUCCESS = 'PUT_RECEIVE_SUCCESS'
export const PUT_REQUEST = 'PUT_REQUEST'

export const RESOURCES_FETCH_REQUEST_LOADING = 'RESOURCE_FETCH_REQUEST_LOADING'
export const RESOURCES_FETCH_REQUEST_SUCCESS =
  'RESOURCES_FETCH_REQUEST_SUCCESS'
export const RESOURCE_ADD = 'RESOURCE_ADD'
export const RESOURCE_DELETE = 'RESOURCE_DELETE'
export const RESOURCE_MODIFY = 'RESOURCE_MODIFY'
export const RESOURCE_MUTATE = 'RESOURCE_MUTATE'
export const RESOURCE_MUTATE_FAILURE = 'RESOURCE_MUTATE_FAILURE'
export const RESOURCE_MUTATE_SUCCESS = 'RESOURCE_MUTATE_SUCCESS'
export const RESOURCE_RECEIVE_FAILURE = 'RESOURCE_RECEIVE_FAILURE'
export const RESOURCE_RECEIVE_SUCCESS = 'RESOURCE_RECEIVE_SUCCESS'
export const RESOURCE_DETAILS_RECEIVE_SUCCESS =
  'RESOURCE_DETAILS_RECEIVE_SUCCESS'
export const RESOURCE_FILTERS_RECEIVE_SUCCESS =
  'RESOURCE_FILTERS_RECEIVE_SUCCESS'
export const RESOURCE_FILTERS_UPDATE = 'RESOURCE_FILTERS_UPDATE'
export const RESOURCE_REQUEST = 'RESOURCE_REQUEST'
export const RESOURCE_DETAILS_REQUEST = 'RESOURCE_DETAILS_REQUEST'
export const RESOURCE_RESET = 'RESOURCE_RESET'

export const ROLE_RECEIVE_FAILURE = 'ROLE_RECEIVE_FAILURE'
export const ROLE_RECEIVE_SUCCESS = 'ROLE_RECEIVE_SUCCESS'

export const SECONDARY_HEADER_UPDATE = 'SECONDARY_HEADER_UPDATE'

export const TABLE_PAGE_CHANGE = 'TABLE_PAGE_CHANGE'
export const TABLE_SEARCH = 'TABLE_SEARCH'
export const TABLE_SORT = 'TABLE_SORT'

export const TOPOLOGY_NAME_SEARCH = 'TOPOLOGY_NAME_SEARCH'
export const TOPOLOGY_RESTORE_SAVED_FILTERS = 'TOPOLOGY_RESTORE_SAVED_FILTERS'
export const TOPOLOGY_SET_ACTIVE_FILTERS = 'TOPOLOGY_SET_ACTIVE_FILTERS'
export const TOPOLOGY_FILTERS_UPDATE = 'TOPOLOGY_FILTERS_UPDATE'
export const TOPOLOGY_FILTERS_REQUEST = 'TOPOLOGY_FILTERS_REQUEST'
export const TOPOLOGY_FILTERS_RECEIVE_ERROR = 'TOPOLOGY_FILTERS_RECEIVE_ERROR'
export const TOPOLOGY_FILTERS_RECEIVE_SUCCESS =
  'TOPOLOGY_FILTERS_RECEIVE_SUCCESS'

export const DIAGRAM_RESTORE_FILTERS = 'DIAGRAM_RESTORE_FILTERS'
export const DIAGRAM_SAVE_FILTERS = 'DIAGRAM_SAVE_FILTERS'

export const UICONFIG_RECEIVE_SUCCESS = 'UICONFIG_RECEIVE_SUCCESS'

export const UPDATE_USERPREFERENCES = 'UPDATE_USERPREFERENCES'

export const USERPREFERENCES_RECEIVE_FAILURE = 'USERPRFERENCES_RECEIVE_FAILURE'
export const USERPREFERENCES_RECEIVE_SUCCESS = 'USERPRFERENCES_RECEIVE_SUCCESS'

export const USER_LOGIN_RECEIVE_SUCCESS = 'USER_LOGIN_RECEIVE_SUCCESS'
export const USER_LOGOUT_RECEIVE_FAILURE = 'USER_LOGOUT_RECEIVE_FAILURE'
export const USER_LOGOUT_RECEIVE_SUCCESS = 'USER_LOGOUT_RECEIVE_SUCCESS'
export const USER_LOGOUT_REQUEST = 'USER_LOGOUT_REQUEST'

export const LOGS_RECEIVE_SUCCESS = 'LOGS_RECEIVE_SUCCESS'
export const LOGS_RECEIVE_FAILURE = 'LOGS_RECEIVE_FAILURE'
export const LOGS_RECEIVE_IN_PROGRESS = 'LOGS_RECEIVE_IN_PROGRESS'

/*
 * other constants specific to particular actions
 */

export const VisibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_COMPLETED: 'SHOW_COMPLETED',
  SHOW_ACTIVE: 'SHOW_ACTIVE'
}

export const USER_LOGIN_STATUS = {
  LOGGED_IN: 'LOGGED_IN',
  LOGGED_OUT: 'LOGGED_OUT'
}

export const REQUEST_STATUS = {
  INCEPTION: 'INCEPTION',
  DONE: 'DONE',
  IN_PROGRESS: 'IN_PROGRESS',
  ERROR: 'ERROR'
}

export const PAGE_SIZES = {
  DEFAULT: 20,
  VALUES: [5, 10, 20, 50, 75, 100]
}

export const SORT_DIRECTION_ASCENDING = 'asc'
export const SORT_DIRECTION_DESCENDING = 'desc'
