import React from 'react'
import PropTypes from 'prop-types'
import Swiper from 'react-native-swiper'
import _filter from 'lodash/filter'
import _isEmpty from 'lodash/isEmpty'
import _get from 'lodash/get'
import { calcVh } from '../../../core/utils/vh'
import withQuery from '../../../core/withQuery'
import BaseCategories from './BaseCategories'
import GetLives from './queries/GetLives'

import ItemComponent from './components/ItemComponent'
import WithOutSignal from './components/WithOutSignalComponent'
import PlaceholderSignal from './components/PlaceholderSignal'
import firebase from 'react-native-firebase'

class SwiperSignalLive extends React.Component {
  componentDidMount () {
    this.getSchedules()
  }

  getSchedules = () => {
    const scheduleCurrentRef = firebase.database().ref('schedules')
    scheduleCurrentRef.on('value', (snapshot) => { this.props.refetch() })
  }

  render () {
    const {
      data,
      loading,
      height,
      width,
      renderPagination,
      styles,
      refSwiper,
      classNames,
      liveSignalProps,
      imageWithOutSignal,
      imageBackgroundDefault,
      teamDefault,
      baseCategoryProps,
      ...props } = this.props
    const wrapperStyle = {
      height: calcVh(height),
      width: width
    }
    if (loading) return <PlaceholderSignal/>
    const _data = _get(data, 'getLives', [])
    const livesWithActiveContent = (_data && _data.length > 0)
      ? _filter(_data, (live) => !_isEmpty(live.schedules))
      : []
    return !_isEmpty(livesWithActiveContent)
      ? <BaseCategories {...baseCategoryProps}>
        {
          ({ baseCategories }) => {
            return (
              <Swiper {...props} ref={refSwiper} containerStyle={wrapperStyle}>
                {(livesWithActiveContent || [])
                  .map((item, index) => (
                    <ItemComponent
                      key={item._id || item.id || index}
                      item={item}
                      styles={styles}
                      classNames={classNames}
                      teamDefault={teamDefault}
                      liveSignalProps={liveSignalProps}
                      imageBackgroundDefault={imageBackgroundDefault}
                      imageWithOutSignal={imageWithOutSignal}
                      baseCategories={baseCategories}
                    />
                  )
                  )}
              </Swiper>
            )
          }
        }
      </BaseCategories>
      : <WithOutSignal
        name={'no-signal-or-content'}
        containerStyle={wrapperStyle}
        styles={styles}
        liveSignalProps={liveSignalProps}
        className={classNames}
        imageWithOutSignal={imageWithOutSignal}
      />
  }
}

SwiperSignalLive.propTypes = {
  data: PropTypes.any,
  loading: PropTypes.bool,
  refSwiper: PropTypes.any,
  renderPagination: PropTypes.bool,
  width: PropTypes.string,
  height: PropTypes.string,
  liveSignalProps: PropTypes.object,
  classNames: PropTypes.object,
  styles: PropTypes.object,
  imageWithOutSignal: PropTypes.object,
  imageBackgroundDefault: PropTypes.object,
  teamDefault: PropTypes.string,
  baseCategoryProps: PropTypes.any,
  refetch: PropTypes.func
}

SwiperSignalLive.defaultProps = {
  refSwiper: null,
  renderPagination: false,
  width: '100%',
  height: '100vh'
}

SwiperSignalLive.getQuery = ({ variables = {}, query = GetLives }) => {
  return ({ query, variables })
}

export default withQuery(SwiperSignalLive)
