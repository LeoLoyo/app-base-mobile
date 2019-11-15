import React from 'react'
import PropTypes from 'prop-types'
import * as Progress from 'react-native-progress'

const ProgressBar = ({
  progress,
  borderWidth,
  borderRadius,
  style,
  height,
  width,
  unfilledColor,
  color
}) => {
  return (
    <Progress.Bar
      progress={progress} // A number between 0 and 1
      borderWidth={borderWidth}
      borderRadius={borderRadius}
      style={style}
      color={color}
      height={height}
      unfilledColor={unfilledColor}
      width={width} />
  )
}

ProgressBar.propTypes = {
  progress: PropTypes.any.isRequired,
  height: PropTypes.number,
  width: PropTypes.number,
  borderWidth: PropTypes.number,
  borderRadius: PropTypes.number,
  style: PropTypes.object,
  unfilledColor: PropTypes.string,
  color: PropTypes.string
}

ProgressBar.defaultProps = {
  width: null,
  height: 10
}

export default ProgressBar
