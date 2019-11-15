import React from 'react'
import PropTypes from 'prop-types'
import View from '../../../native/View'
import Image from '../../../native/CachedImage'
import Text from '../../../native/Text'
/**
 * Opponent Component
 */

const Opponent = React.memo(({
  boxOpponentProps,
  opponentImageProps,
  image,
  horizontalList,
  textOpponentProps,
  text,
  side
}) => {
  const { imageDefault, presetDefault = '?w=150&h=150', contentRowProps, ...props } = opponentImageProps
  if (!image && !imageDefault) {
    console.warn('it needs a image maybe image or imageDefault: ', opponentImageProps)
    return null
  }
  const imageEnhance = image ? `${image}${presetDefault}` : imageDefault

  const boxImage = (
    <View {...boxOpponentProps}>
      <Image {...props} source={{ uri: imageEnhance }} />
    </View>
  )

  const textDescription = (<Text {...textOpponentProps} text={text} />)

  if (horizontalList === undefined) {
    return boxImage
  }

  return (
    <View {...contentRowProps}>
      {
        side === 'left'
          ? [textDescription, boxImage]
          : [boxImage, textDescription]
      }
    </View>
  )
})

Opponent.displayName = 'Opponent'

Opponent.propTypes = {
  boxOpponentProps: PropTypes.object,
  opponentImageProps: PropTypes.object,
  textOpponentProps: PropTypes.object,
  image: PropTypes.string,
  text: PropTypes.string,
  side: PropTypes.string,
  horizontalList: PropTypes.bool
}
export default Opponent
