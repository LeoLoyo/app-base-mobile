import React from 'react'
import PropTypes from 'prop-types'
import View from '../../../native/View'
import Text from '../../../native/Text'

/**
 * Description of a Schedule
 */
const DescriptionSchedules = React.memo(({
  wrapperDescriptionProps,
  textLeft,
  textRight,
  descriptionSchedulesProps
}) => {
  const {
    textDefault,
    textOpponentProps,
    separator: { hasSeparator, separatorProps }
  } = descriptionSchedulesProps
  return (
    <View {...wrapperDescriptionProps}>
      <Text {...textOpponentProps} text={textLeft || textDefault} />

      {/* Separator */}
      {hasSeparator && <Text {...separatorProps} />}

      <Text {...textOpponentProps} text={textRight || textDefault} />
    </View>
  )
})

DescriptionSchedules.displayName = 'DescriptionSchedules'

DescriptionSchedules.propTypes = {
  wrapperDescriptionProps: PropTypes.object,
  textLeft: PropTypes.string,
  textLeftProps: PropTypes.object,
  textRight: PropTypes.string,
  textRightProps: PropTypes.object,
  descriptionSchedulesProps: PropTypes.shape({
    textDefault: PropTypes.string,
    separator: PropTypes.shape({
      hasSeparator: PropTypes.bool,
      separatorProps: PropTypes.object
    }),
    textOpponentProps: PropTypes.object
  })
}

export default DescriptionSchedules
