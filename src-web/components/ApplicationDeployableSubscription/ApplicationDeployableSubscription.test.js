/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2016, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

const React = require('../../../node_modules/react')
const renderer = require('../../../node_modules/react-test-renderer')
const ApplicationDeployableSubscription = require('../ApplicationDeployableSubscription')
  .default

describe('ApplicationDeployableSubscription', () => {
  it('ApplicationDeployableSubscription renders correctly.', () => {
    const tree = renderer
      .create(<ApplicationDeployableSubscription />)
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})