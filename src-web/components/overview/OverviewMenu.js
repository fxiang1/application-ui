/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import AutoRefreshMenu from '../common/AutoRefreshMenu'
import FilterView from './modals/FilterView'
import { getDefaultViewState } from './defaults.js'
import { OVERVIEW_REFRESH_INTERVAL_COOKIE, OVERVIEW_COOKIE  } from '../../../lib/shared/constants'
import msgs from '../../../nls/platform.properties'
import _ from 'lodash'

export default class OverviewMenu extends React.Component {

  static propTypes = {
    pollInterval: PropTypes.number,
    startPolling: PropTypes.func,
    stopPolling: PropTypes.func,
    view: PropTypes.object,
  }

  constructor (props) {
    super(props)
    this.state = {
      filterViewOpen: false,
    }
    this.handleFilterClose = this.handleFilterClose.bind(this)
    this.updateActiveFilters = this.updateActiveFilters.bind(this)
  }

  componentWillMount() {
    const { locale } = this.context

    this.onUnload = this.onUnload.bind(this)
    window.addEventListener('beforeunload', this.onUnload)

    // menu options
    this.viewMenuChoices = [
      {text: msgs.get('overview.menu.filter', locale),
        action: this.openFilterModel.bind(this)},
      //      {text: msgs.get('overview.menu.new', locale),
      //        action: this.newCard.bind(this)},
      {text: msgs.get('overview.menu.save', locale),
        action: this.saveView.bind(this)},
      {text: msgs.get('overview.menu.restore', locale),
        action: this.restoreView.bind(this),
        isDelete: true},
    ]
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.onUnload)
  }

  onUnload(event) {
    const { locale } = this.context
    const { view: {getCurrentViewState} } = this.props
    if (!_.isEqual(getCurrentViewState(), getSavedViewState(locale))) {
      event.returnValue = msgs.get('overview.unsaved.changes', locale)
    }
  }

  render() {
    const { view, startPolling, stopPolling, pollInterval } = this.props
    const { filterViewOpen } = this.state
    return (
      <div>
        <AutoRefreshMenu
          startPolling={startPolling}
          stopPolling={stopPolling}
          pollInterval={pollInterval}
          refreshCookie={OVERVIEW_REFRESH_INTERVAL_COOKIE}
          otherOptions={this.viewMenuChoices}
        />
        { filterViewOpen &&
          <FilterView
            context={this.context}
            updateActiveFilters={this.updateActiveFilters}
            onClose={this.handleFilterClose}
            view={view}
          /> }
      </div>
    )
  }

  openFilterModel() {
    this.setState({ filterViewOpen: true })
  }

  handleFilterClose = () => {
    this.setState({ filterViewOpen: false })
  }

  updateActiveFilters = (activeFilters) => {
    const { view: {updateActiveFilters} } = this.props
    updateActiveFilters(activeFilters)
  }

  newCard() {
  }

  saveView() {
    const { view: {getCurrentViewState} } = this.props
    const state = getCurrentViewState()
    saveViewState(state)
  }

  restoreView() {
    const { view: {refreshCardOrder} } = this.props
    resetViewState()
    refreshCardOrder()
  }

}

export const getSavedViewState = (locale) => {
  let state = null
  const savedState = localStorage.getItem(OVERVIEW_COOKIE)
  if (savedState) {
    try {
      state = JSON.parse(savedState)
    } catch (e) {
      //
    }
  }
  if (!state) {
    state = getDefaultViewState(locale)
  }
  return state
}

export const saveViewState = (state) => {
  localStorage.setItem(OVERVIEW_COOKIE, JSON.stringify(state))
}

export const resetViewState = () => {
  localStorage.removeItem(OVERVIEW_COOKIE)
}

