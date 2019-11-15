import React from 'react'
import PropTypes from 'prop-types'
import {View, Dimensions} from 'react-native'
import Carousel, { getInputRangeFromIndexes, Pagination } from 'react-native-snap-carousel'
import {CustomComponentProvider} from '../../core/withCustomComponent'
const {width: $width} = Dimensions.get('screen')

export class AppCarousel extends React.Component {
  _carousel = null

  state = {
    index: 0
  }

  _renderItem = ({item, index}) => {
    const { prevContextElement, itemProps } = this.props
    const props = {
      ...item,
      ...itemProps,
      index,
      prevContextElement
    }

    return (
      <CustomComponentProvider {...this.props} components={['ItemComponent']} >
        {({ItemComponent = View}) => (<ItemComponent {...props} />)}
      </CustomComponentProvider>
    )
  }

  _scrollInterpolator = (index, carouselProps) => {
    const range = [2, 1, 0, -1]
    const inputRange = getInputRangeFromIndexes(range, index, carouselProps)
    const outputRange = range
    return { inputRange, outputRange }
  }

  _onSnapToItem = (index) => this.setState({ index })

  animatedStyles = (index, animatedValue, carouselProps) => {
    const sizeRef = carouselProps.vertical ? carouselProps.itemHeight : carouselProps.itemWidth
    const translateProp = carouselProps.vertical ? 'translateY' : 'translateX'

    return {
      zIndex: carouselProps.data.length - index,
      transform: [{
        [translateProp]: animatedValue.interpolate({
          inputRange: [-1, 0, 1, 2],
          outputRange: [
            0,
            0,
            -sizeRef * 2,
            -sizeRef
          ],
          extrapolate: 'clamp'
        })
      }]
    }
  }

  get pagination () {
    const {data, dotColor, activeDotColor, dotStyle} = this.props
    return (
      <Pagination
        dotsLength={(data || []).length}
        activeDotIndex={this.state.index}
        dotColor={activeDotColor}
        inactiveDotColor={dotColor}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
        dotStyle={dotStyle}
        carouselRef={this._carousel}
        tappableDots={true}
      />
    )
  }

  render () {
    const {sliderWidth = $width, itemWidth = $width, data = []} = this.props
    return (
      <View>
        <Carousel
          ref={c => (this._carousel = c)}
          data={data}
          renderItem={this._renderItem}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          scrollInterpolator={this._scrollInterpolator}
          slideInterpolatedStyle={this.animatedStyles}
          loop
          autoplay
          onSnapToItem={this._onSnapToItem}
        />

        {this._carousel && this.pagination}

      </View>
    )
  }
}

AppCarousel.propTypes = {
  sliderWidth: PropTypes.number,
  itemWidth: PropTypes.number,
  data: PropTypes.any,
  prevContextElement: PropTypes.any,
  itemProps: PropTypes.object,
  dotColor: PropTypes.any,
  activeDotColor: PropTypes.any,
  dotStyle: PropTypes.any
}

export default AppCarousel
