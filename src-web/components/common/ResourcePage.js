/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import ResourceList from './ResourceList'
import { Route, Switch } from 'react-router-dom'
import getResourceDefinitions from '../../definitions'
import { makeGetVisibleTableItemsSelector } from '../../reducers/common'

const WrappedResourceList = props =>
  <div>
    <ResourceList
      resourceType={props.resourceType}
      staticResourceData={props.staticResourceData}
      getVisibleResources={props.getVisibleResources}
      tabs={props.secondaryHeaderProps.tabs}
      title={props.secondaryHeaderProps.title}>
      {props.buttons}
    </ResourceList>
  </div>

const ResourcePageWithList = props =>
  <Switch>
    <Route exact path={props.match.url} render={() => (
      <WrappedResourceList {...props} />
    )} />
  </Switch>

const typedResourcePageWithList = (resourceType, detailsTabs, buttons) => {

  const staticResourceData = getResourceDefinitions(resourceType)
  const getVisibleResources = makeGetVisibleTableItemsSelector(resourceType)

  // eslint-disable-next-line react/display-name
  return class extends React.PureComponent {

    constructor(props) {
      super(props)
    }

    render() {
      return (
        <ResourcePageWithList
          {...this.props}
          detailsTabs={detailsTabs}
          resourceType={resourceType}
          staticResourceData={staticResourceData}
          getVisibleResources={getVisibleResources}
          buttons={buttons}>
        </ResourcePageWithList>
      )
    }
  }
}

export { typedResourcePageWithList }
