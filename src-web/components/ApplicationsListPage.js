/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import { RESOURCE_TYPES } from '../../lib/shared/constants'
import { typedResourcePageList } from './common/ResourcePage'
import { AcmTablePaginationContextProvider } from '@stolostron/ui-components'

const TypedResourcePageList = typedResourcePageList(
  RESOURCE_TYPES.QUERY_APPLICATIONS,
  [],
  [],
  []
)

const ApplicationsListPage = props => (
  <AcmTablePaginationContextProvider localStorageKey="application-table-pagination">
    <TypedResourcePageList {...props} />
  </AcmTablePaginationContextProvider>
)

export default ApplicationsListPage
