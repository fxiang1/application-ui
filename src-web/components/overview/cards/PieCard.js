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
import resources from '../../../../lib/shared/resources'
import { PieChart, Pie, Cell, Label } from 'recharts'
import { getDataValues } from '../dataHelper'
import { getPercentage, getTotal } from '../../../../lib/client/charts-helper'
import GridCard from '../GridCard'
import msgs from '../../../../nls/platform.properties'

resources(() => {
  require('../../../../scss/overview-charts.scss')
})

const PieLabel = ({ value, label, viewBox }) => {
  return (
    <text x={viewBox.cx} y={viewBox.cy} textAnchor='middle' fill='#152935' fontWeight='300'>
      <tspan x={viewBox.cx} fontSize='13px' letterSpacing='.5px'>
        <tspan fontSize='30px'>{value}</tspan>
        <tspan fontSize='15px' dy='-10'>%</tspan>
      </tspan>
      <tspan x={viewBox.cx} dy='30' textAnchor='middle' dx='-4' fontSize='13px'>{label}</tspan>
    </text>
  )
}

PieLabel.propTypes = {
  label: PropTypes.string,
  value: PropTypes.number,
  viewBox: PropTypes.object,
}

const PieGraph = ({
  header,
  tagValue,
  label,
  percentage,
  chartData,
  item,
}) =>
  <GridCard header={header} tagValue={tagValue} item={item}>
    {(() => {
      return (
        <div className='pie-graph'>
          <div className='pie-graph__container'>
            <PieChart width={100} height={100}>
              <Pie data={chartData} dataKey='value' cx='50%' cy='50%' innerRadius={40} outerRadius={50} fill="#82ca9d">
                <Label value={percentage} content={<PieLabel label={label} />} />
                {
                  chartData.map((entry) => (
                    <Cell key={entry.name} className={entry.className} />
                  ))
                }
              </Pie>
            </PieChart>
          </div>
          <div className='pie-graph__legend'>
            {chartData.map((entry) => {
              return (
                <div className={`legend-item bottom_border ${entry.className}`} key={entry.name} >
                  <span className='value'>{entry.value} {entry.units?entry.units:''}</span>
                  <span className='label' title={entry.name}>{entry.name}</span>
                </div>
              )
            })}
          </div>
        </div>
      )
    }
    )()}
  </GridCard>

PieGraph.propTypes = {
  chartData: PropTypes.array,
  header: PropTypes.string,
  item: PropTypes.object,
  label: PropTypes.string,
  percentage: PropTypes.number,
  tagValue: PropTypes.string,
}


class PieCard extends React.Component {
  render() {
    const { item } = this.props
    const { cardData: {title, dataType, labelKey, pieData}, overview } = item

    let label, chartData, percentage, total
    // pie chart as pie chart
    if (pieData) {

      // count up statuses
      const {valueMap} = getDataValues(overview, dataType, pieData)

      // create pie chart data
      label = pieData[labelKey].name
      chartData = Object.keys(pieData).map(key=>{
        return {
          name: pieData[key].name,
          className: pieData[key].className,
          value: valueMap[key] ? valueMap[key].length : 0,
        }
      })
      total=getTotal(chartData)
      percentage= valueMap[labelKey] ? getPercentage(valueMap[labelKey].length, total) : 0

    } else {
    // line chart as pie chart
      const {available, used, units} = getDataValues(overview, dataType)

      chartData=[]
      label = msgs.get('overview.status.used', this.context.locale)
      chartData.push({
        name: msgs.get('overview.status.used', this.context.locale),
        units,
        className:'used',
        value: Math.round(used)
      })
      chartData.push({
        name: msgs.get('overview.status.available', this.context.locale),
        units,
        className:'available',
        value: Math.round(available-used)
      })
      total = available
      percentage = getPercentage(used, total)
    }

    return (
      <PieGraph
        header={title}
        tagValue={total.toString()}
        label={label}
        chartData={chartData}
        total={total}
        percentage={percentage}
        item={item}
      />
    )
  }
}

PieCard.propTypes = {
  item: PropTypes.object,
}

export default PieCard
