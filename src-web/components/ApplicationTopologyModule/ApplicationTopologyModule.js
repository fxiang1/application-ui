/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { withLocale } from '../../providers/LocaleProvider'
import {
  getActiveChannel,
  getDiagramElements
} from './definitions/hcm-application-diagram'
import { fetchTopology } from '../../actions/topology'
import { processResourceActionLink } from '../Topology/utils/diagram-helpers'
import { DIAGRAM_QUERY_COOKIE } from '../../../lib/shared/constants'
import { AcmAlert } from '@stolostron/ui-components'
import '../../../graphics/diagramIcons.svg'
import {
  TOPOLOGY_SET_ACTIVE_FILTERS,
  DIAGRAM_RESTORE_FILTERS,
  DIAGRAM_SAVE_FILTERS,
  REQUEST_STATUS
} from '../../actions'
import resources from '../../../lib/shared/resources'
import { Topology } from '../Topology'
import config from '../../../lib/shared/config'
import msgs from '../../../nls/platform.properties'
import _ from 'lodash'
import {
  startPolling,
  stopPolling,
  handleRefreshPropertiesChanged,
  handleVisibilityChanged
} from '../../shared/utils/refetch'
import { refetchIntervalUpdate } from '../../actions/refetch'

resources(() => {
  require('./style.scss')
  require('../Topology/scss/topology-controls.scss')
  require('../Topology/scss/resource-toolbar.scss')
})

// set up Topology component
const portals = {
  assortedFilterOpenBtn: 'assorted-filter-open-portal-id',
  assortedFilterCloseBtns: 'assorted-filter-close-portal-id',
  typeFilterBar: 'type-filter-bar-portal-id',
  searchTextbox: 'search-textbox-portal-id'
}

const options = {
  filtering: 'application',
  layout: 'application',
  showLineLabels: true, // show labels on lines
  showGroupTitles: false // show titles over sections
}

class ApplicationTopologyModule extends React.Component {
  static propTypes = {
    HCMApplicationList: PropTypes.object,
    activeChannel: PropTypes.string,
    channels: PropTypes.array,
    clusters: PropTypes.array,
    detailsLoaded: PropTypes.bool,
    detailsReloading: PropTypes.bool,
    diagramFilters: PropTypes.array,
    fetchAppTopology: PropTypes.func,
    fetchError: PropTypes.object,
    links: PropTypes.array,
    locale: PropTypes.string,
    nodes: PropTypes.array,
    params: PropTypes.object,
    refetch: PropTypes.object,
    refetchIntervalUpdateDispatch: PropTypes.func,
    resetFilters: PropTypes.func,
    restoreSavedDiagramFilters: PropTypes.func,
    storedVersion: PropTypes.bool,
    topologyLoadError: PropTypes.bool,
    topologyLoaded: PropTypes.bool,
    topologyReloading: PropTypes.bool,
    willLoadDetails: PropTypes.bool
  };

  constructor(props) {
    super(props)
    this.state = {
      links: [],
      nodes: [],
      activeChannel: undefined,
      showSpinner: false,
      lastTimeUpdate: undefined,
      userChanges: false /* eslint-disable-line react/no-unused-state */,
      exceptions: [],
      updateMessage: '',
      topologyLoaded: false,
      selectedNode: undefined,
      showLegendView: false
    }
    this.reload = this.reload.bind(this)
  }

  UNSAFE_componentWillMount() {
    const { restoreSavedDiagramFilters, resetFilters, params } = this.props
    restoreSavedDiagramFilters()
    resetFilters()
    const name = decodeURIComponent(params.name)
    const namespace = decodeURIComponent(params.namespace)
    const localStoreKey = `${DIAGRAM_QUERY_COOKIE}\\${namespace}\\${name}`
    const activeChannel = getActiveChannel(localStoreKey)
    this.props.fetchAppTopology(activeChannel)
    this.setState({ activeChannel })
  }

  componentDidMount() {
    document.addEventListener('visibilitychange', this.onVisibilityChange)
    startPolling(this, setInterval)
  }

  componentWillUnmount() {
    stopPolling(this.state, clearInterval)
    document.removeEventListener('visibilitychange', this.onVisibilityChange)
  }

  onVisibilityChange = () => {
    handleVisibilityChanged(this, clearInterval, setInterval)
  };

  componentDidUpdate(prevProps) {
    handleRefreshPropertiesChanged(prevProps, this, clearInterval, setInterval)
  }

  // call to actually refetch the new data
  reload() {
    const { fetchAppTopology, activeChannel } = this.props
    fetchAppTopology(activeChannel, true)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState(prevState => {
      const { locale } = this.props
      const links = _.cloneDeep(nextProps.links || [])
      const nodes = _.cloneDeep(nextProps.nodes || [])
      const clusters = _.cloneDeep(nextProps.clusters || [])
      const diagramFilters = _.cloneDeep(nextProps.diagramFilters || [])

      // update loading spinner
      const {
        topologyReloading,
        willLoadDetails,
        detailsLoaded,
        detailsReloading,
        storedVersion,
        fetchError,
        refetch
      } = nextProps

      const showSpinner =
        !fetchError &&
        (topologyReloading ||
          willLoadDetails ||
          !detailsLoaded ||
          detailsReloading ||
          storedVersion)

      // update last time refreshed
      const { changingChannel } = prevState
      let lastTimeUpdate = prevState.lastTimeUpdate

      if (
        changingChannel ||
        (!showSpinner && prevState.showSpinner) ||
        (!lastTimeUpdate && nextProps.topologyLoaded)
      ) {
        const time = new Date().toLocaleTimeString(locale)
        lastTimeUpdate = msgs.get(
          'application.diagram.view.last.time',
          [time],
          locale
        )
      }

      return {
        clusters,
        links,
        nodes,
        diagramFilters,
        changingChannel: false,
        showSpinner,
        lastTimeUpdate,
        topologyLoaded: nextProps.topologyLoaded,
        topologyLoadError: nextProps.topologyLoadError,
        refetch
      }
    })
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      _.get(nextProps, 'HCMApplicationList.status', '') ===
        REQUEST_STATUS.DONE ||
      _.get(nextProps, 'HCMApplicationList.status', '') === REQUEST_STATUS.ERROR
    ) {
      return true //always update when search is done
    }
    if (
      nextProps.activeChannel !== undefined &&
      nextState.activeChannel !== undefined &&
      nextProps.activeChannel !== nextState.activeChannel
    ) {
      return false
    }

    const isDiagramChanged =
      !_.isEqual(
        this.state.nodes.map(n => n.uid),
        nextState.nodes.map(n => n.uid)
      ) ||
      !_.isEqual(
        this.state.links.map(n => n.uid),
        nextState.links.map(n => n.uid)
      ) ||
      !_.isEqual(this.state.diagramFilters, nextState.diagramFilters)

    const loadedInfoChanged =
      this.props.topologyLoaded !== nextProps.topologyLoaded ||
      this.props.detailsLoaded !== nextProps.detailsLoaded ||
      this.props.detailsReloading !== nextProps.detailsReloading ||
      this.state.topologyLoadError !== nextState.topologyLoadError

    const channelInfoChanged =
      this.state.activeChannel !== nextState.activeChannel ||
      this.props.storedVersion !== nextProps.storedVersion ||
      !_.isEqual(this.props.channels, nextProps.channels)

    const updateIntervalChanged =
      this.state.lastTimeUpdate !== nextState.lastTimeUpdate ||
      this.props.refetch.interval !== nextState.refetch.interval ||
      this.props.refetch.doRefetch !== nextState.refetch.doRefetch

    const genericChange =
      !_.isEqual(this.state.exceptions, nextState.exceptions) ||
      this.state.updateMessage !== nextState.updateMessage ||
      this.state.showSpinner !== nextState.showSpinner ||
      this.state.showLegendView !== nextState.showLegendView

    return (
      isDiagramChanged ||
      loadedInfoChanged ||
      channelInfoChanged ||
      updateIntervalChanged ||
      genericChange
    )
  }

  setContainerRef = container => {
    this.containerRef = container
  };

  setViewer = viewer => {
    this.viewer = viewer
  };

  getViewer = () => this.viewer;
  handleTopologyErrorClosed = () => this.setState({ topologyLoadError: false });
  handleUpdateMessageClosed = () => this.setState({ updateMessage: '' });

  render() {
    const {
      channels,
      refetchIntervalUpdateDispatch,
      locale,
      HCMApplicationList
    } = this.props
    const {
      nodes,
      links,
      selectedNode,
      topologyLoadError,
      activeChannel,
      showLegendView
    } = this.state
    const { topologyLoaded, showSpinner, changingChannel } = this.state

    const diagramTitle = msgs.get('application.diagram', locale)

    const isLoadError =
      topologyLoadError || HCMApplicationList.status === REQUEST_STATUS.ERROR
    const diagramClasses = classNames({
      resourceDiagramSourceContainer: true,
      showExpandedTopology: false
    })
    const renderTopology = () => {
      const fetchControl = {
        isLoaded: topologyLoaded,
        isFailed: isLoadError,
        isReloading: showSpinner,
        refetch: this.refetch
      }
      const channelControl = {
        allChannels: channels,
        activeChannel: activeChannel,
        isChangingChannel: changingChannel,
        changeTheChannel: this.changeTheChannel.bind(this)
      }
      const selectionControl = {
        selectedNode
      }
      options.scrollOnScroll = true
      return (
        <Topology
          links={links}
          nodes={nodes}
          options={options}
          portals={portals}
          selectionControl={selectionControl}
          processActionLink={this.processActionLink.bind(this)}
          fetchControl={fetchControl}
          channelControl={channelControl}
          searchUrl={
            config.contextPath
              ? config.contextPath.replace(
                new RegExp('/applications$'),
                '/search'
              )
              : ''
          }
          locale={locale}
          showLegendView={showLegendView}
          handleLegendClose={this.handleLegendClose.bind(this)}
          refetchIntervalUpdateDispatch={refetchIntervalUpdateDispatch}
        />
      )
    }

    const renderDiagramView = () => {
      return (
        <React.Fragment>
          <React.Fragment>
            <div className="topology-controls">
              <div className="topology-control-container">
                <div id={portals.searchTextbox} />
              </div>
            </div>
            <div id="resource-toolbar" className="resource-toolbar">
              <div className="resource-toolbar-container">
                <div className="resource-toolbar-buttons">
                  <div id={portals.assortedFilterOpenBtn} />
                </div>
                <div id={portals.assortedFilterCloseBtns} />
              </div>
            </div>
          </React.Fragment>
          <div className="resourceDiagramControlsContainer">
            {!isLoadError && (
              <div className="diagram-title">
                {diagramTitle}
                <svg className="diagram-title-divider">
                  <rect />
                </svg>
                <span
                  className="how-to-read-text"
                  tabIndex="0"
                  onClick={() => {
                    this.setState({ showLegendView: true })
                  }}
                  onKeyPress={() => {
                    // noop function
                  }}
                  role="button"
                >
                  {msgs.get(
                    'application.diagram.how.to.read',
                    this.context.locale
                  )}
                  <svg className="how-to-read-icon">
                    <use href={'#diagramIcons_sidecar'} />
                  </svg>
                </span>
              </div>
            )}
            <React.Fragment>{!isLoadError && renderTopology()}</React.Fragment>
          </div>
          {isLoadError && (
            <AcmAlert
              title={msgs.get('error.load.resource', this.context.locale)}
              subtitle={msgs.get('error.load.topology', this.context.locale)}
              variant="danger"
              onClick={this.handleTopologyErrorClosed}
            />
          )}
        </React.Fragment>
      )
    }

    return (
      <div className={diagramClasses} ref={this.setContainerRef}>
        {renderDiagramView()}
      </div>
    )
  }

  changeTheChannel(fetchChannel) {
    this.setState({ changingChannel: true, activeChannel: fetchChannel })
    this.props.fetchAppTopology(fetchChannel)
  }

  processActionLink = resource => {
    processResourceActionLink(resource)
  };

  handleLegendClose = () => {
    this.setState({ showLegendView: false })
  };
}

const mapStateToProps = (state, ownProps) => {
  const { params } = ownProps
  const { HCMApplicationList, refetch } = state
  const name = decodeURIComponent(params.name)
  const namespace = decodeURIComponent(params.namespace)
  let { topology } = state

  if (!topology) {
    topology = {
      activeFilters: {},
      fetchFilters: null,
      fetchError: null,
      diagramFilters: []
    }
  }
  const {
    activeFilters,
    fetchFilters,
    fetchError,
    diagramFilters = []
  } = topology

  let localStoreKey = `${DIAGRAM_QUERY_COOKIE}\\${namespace}\\${name}`
  const fetchApplication = _.get(topology, 'fetchFilters.application')
  if (fetchApplication) {
    localStoreKey = `${DIAGRAM_QUERY_COOKIE}\\${fetchApplication.namespace}\\${
      fetchApplication.name
    }`
  }
  const diagramElements = getDiagramElements(
    topology,
    localStoreKey,
    name,
    namespace,
    HCMApplicationList
  )

  return {
    ...diagramElements,
    activeFilters,
    fetchFilters,
    fetchError,
    diagramFilters,
    HCMApplicationList,
    refetch
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const { params: { namespace, name } } = ownProps
  return {
    refetchIntervalUpdateDispatch: data =>
      dispatch(refetchIntervalUpdate(data)),
    resetFilters: () => {
      dispatch({
        type: TOPOLOGY_SET_ACTIVE_FILTERS,
        activeFilters: {}
      })
    },
    fetchAppTopology: (fetchChannel, reloading) => {
      const fetchFilters = {
        application: { name, namespace, channel: fetchChannel }
      }
      dispatch(
        fetchTopology({ filter: { ...fetchFilters } }, fetchFilters, reloading)
      )
    },
    restoreSavedDiagramFilters: () => {
      dispatch({
        type: DIAGRAM_RESTORE_FILTERS,
        namespace,
        name,
        initialDiagramFilters: []
      })
    },
    onDiagramFilterChange: (filterType, diagramFilters) => {
      dispatch({
        type: DIAGRAM_SAVE_FILTERS,
        namespace,
        name,
        diagramFilters
      })
    }
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(
    withLocale(ApplicationTopologyModule)
  )
)
