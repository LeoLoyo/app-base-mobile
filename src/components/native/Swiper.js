import React from 'react'
import PropTypes from 'prop-types'
import Swiper from 'react-native-swiper'
import {View} from 'react-native'
import {CustomComponentProvider} from '../../core/withCustomComponent'
import withStyle from '../../core/withStyle'
import { calcVh } from '../../core/utils/vh'

const SwiperComponent = ({data, height, width, renderPagination, refSwiper, ...props}) => {
  const wrapperStyle = {
    height: calcVh(height),
    width: width
  }
  return (
    <CustomComponentProvider {...props} components={['ItemComponent']} >
      {({ItemComponent = View}) => {
        return (
          <Swiper {...props} ref={refSwiper} containerStyle={wrapperStyle}>
            {(data || []).map((item, index) => <ItemComponent key={item._id || item.id || index} {...item} />)}
          </Swiper>
        )
      }}
    </CustomComponentProvider>
  )
}

SwiperComponent.propTypes = {
  data: PropTypes.array.isRequired,
  refSwiper: PropTypes.any,
  renderPagination: PropTypes.bool,
  width: PropTypes.string,
  height: PropTypes.string
}

SwiperComponent.defaultProps = {
  data: [],
  refSwiper: null,
  renderPagination: false,
  width: '100%',
  height: '100vh'
}
export default withStyle(SwiperComponent, ['containerStyle', 'paginationStyle'])
