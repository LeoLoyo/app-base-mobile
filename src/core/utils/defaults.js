import { Dimensions } from 'react-native'

import { defaultsDeep, each, get } from 'lodash'

import defaultTheme from './defaultTheme'
import fonts from './fonts'

const constraints = {
  width: Dimensions.get('screen').width,
  height: Dimensions.get('screen').height
}
const buildDefaults = (theme, styles, variables) => {
  const themeToApply = defaultsDeep(theme, defaultTheme)

  const classes = []

  /**
   * Posisioning
   */
  classes['position-relative'] = {position: 'relative'}
  classes['position-absolute'] = {position: 'absolute'}

  /**
   * Flex Orientation
   */
  classes['flex-row'] = {flexDirection: 'row'}
  classes['flex-column'] = {flexDirection: 'column'}
  classes['flex-direction-row-reverse'] = {flexDirection: 'row-reverse'}
  classes['flex-direction-column-reverse'] = {flexDirection: 'column-reverse'}

  /**
   * Flex Options
   */
  each(themeToApply['flex'], (value, key) => {
    classes[`flex-${key}`] = {flex: parseInt(value)}
  })

  /**
   *  Utility Classes
   */
  classes['absolute-fill'] = {position: 'absolute', top: 0, left: 0, bottom: 0, right: 0}
  classes['cell'] = {flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}

  /**
   * Alignments
   */
  each(['flex-start', 'flex-end', 'center', 'stretch', 'center', 'space-between', 'space-around'], (alignment, key) => {
    classes[`align-items-${alignment}`] = {alignItems: alignment}
    classes[`align-self-${alignment}`] = {alignSelf: alignment}
    classes[`justify-content-${alignment}`] = {justifyContent: alignment}
  })
  /**
   * Borders
   */
  classes['border'] = {borderTopWidth: get(themeToApply, 'options.defaultBorderRadius', 0)}
  each(themeToApply['borderWidth'], (value, key) => {
    classes[`border-${key}`] = {borderWidth: parseInt(value)}
    classes[`border-top-${key}`] = {borderTopWidth: parseInt(value)}
    classes[`border-bottom-${key}`] = {borderBottomWidth: parseInt(value)}
    classes[`border-left-${key}`] = {borderLeftWidth: parseInt(value)}
    classes[`border-right-${key}`] = {borderRightWidth: parseInt(value)}
  })

  each(themeToApply['colors'], (color, key) => {
    /**
     * Border Colors
     */
    classes[`border-color-${key}`] = {borderColor: color}
    classes[`border-color-top-${key}`] = {borderTopColor: color}
    classes[`border-color-bottom-${key}`] = {borderBottomColor: color}
    classes[`border-color-left-${key}`] = {borderRightColor: color}
    classes[`border-color-right-${key}`] = {borderLeftColor: color}

    /**
     * Backgrounds, Text Colors
     */
    classes[`bg-${key}`] = {backgroundColor: color}
    classes[`text-color-${key}`] = {color}
    classes[`text-color-${color}`] = {color}
    classes[`toast-${key}`] = {backgroundColor: color}
  })

  /**
   * Border Radius
   */
  classes['rounded'] = {borderRadius: get(themeToApply, 'options.defaultBorderRadius', 0)}
  each(themeToApply['radius'], (radius, key) => {
    classes[`border-radius-${key}`] = {borderRadius: radius}
    classes[`border-radius-top-${key}`] = {borderTopStartRadius: radius, borderTopEndRadius: radius}
    classes[`border-radius-bottom-${key}`] = {borderBottomStartRadius: radius, borderBottomEndRadius: radius}
    classes[`border-radius-left-${key}`] = {borderTopLeftRadius: radius, borderBottomLeftRadius: radius}
    classes[`border-radius-right-${key}`] = {borderTopRightRadius: radius, borderBottomRightRadius: radius}
  })

  /**
   * Text Alignments
   */

  each(['auto', 'left', 'right', 'center', 'justify'], (alignment, key) => {
    classes[`text-align-${alignment}`] = {textAlign: alignment}
  })

  /**
   * Text Size
   */
  each(themeToApply['fontSize'], (size, key) => {
    classes[`font-size-${key}`] = {fontSize: `${size}rem`}
  })

  /**
   * Text Style
   */
  classes['font-style-italic'] = {fontStyle: 'italic'}
  classes['font-style-normal'] = {fontStyle: 'normal'}
  classes['font-style-bold'] = {fontWeight: 'bold'}

  /**
   * Text Weight
   */
  classes['font-weight-normal'] = {fontWeight: 'normal'}
  classes['font-weight-bold'] = {fontWeight: 'bold'}
  classes['font-weight-100'] = {fontWeight: '100'}
  classes['font-weight-200'] = {fontWeight: '200'}
  classes['font-weight-300'] = {fontWeight: '300'}
  classes['font-weight-400'] = {fontWeight: '400'}
  classes['font-weight-500'] = {fontWeight: '500'}
  classes['font-weight-600'] = {fontWeight: '600'}
  classes['font-weight-700'] = {fontWeight: '700'}
  classes['font-weight-800'] = {fontWeight: '800'}
  classes['font-weight-900'] = {fontWeight: '900'}

  /**
   * Aspect ratios
   */
  classes['aspect-ratio-16-9'] = {aspectRatio: (16 / 9)}
  classes['aspect-ratio-4-3'] = {aspectRatio: (4 / 3)}
  /**
   * Height, Width
   */
  each(themeToApply['percentages'], (scale, key) => {
    const calculatedHeight = constraints['height'] * (scale / 100)
    const calculatedWidth = constraints['width'] * (scale / 100)

    classes[`h-${key}`] = {height: `${parseInt(scale)}%`}
    classes[`w-${key}`] = {width: `${parseInt(scale)}%`}

    if (variables.$rem) {
      classes[`h-${key}rem`] = {height: scale * variables.$rem}
      classes[`w-${key}rem`] = {width: scale * variables.$rem}
    }

    classes[`h-viewport-${key}`] = {height: calculatedHeight}
    classes[`w-viewport-${key}`] = {width: calculatedWidth}
  })
  /**
   *  Padding, Margin
   */
  each(themeToApply['spacing'], (scale, key) => {
    const calculatedHeight = constraints['height'] * (scale / 100)
    const calculatedWidth = constraints['width'] * (scale / 100)
    classes[`mt-${key}`] = {marginTop: calculatedHeight}
    classes[`mb-${key}`] = {marginBottom: calculatedHeight}
    classes[`my-${key}`] = {marginVertical: calculatedHeight}
    classes[`ml-${key}`] = {marginLeft: calculatedWidth}
    classes[`mr-${key}`] = {marginRight: calculatedWidth}
    classes[`mx-${key}`] = {marginHorizontal: calculatedWidth}

    classes[`pt-${key}`] = {paddingTop: calculatedHeight}
    classes[`pb-${key}`] = {paddingBottom: calculatedHeight}
    classes[`py-${key}`] = {paddingVertical: calculatedHeight}
    classes[`pl-${key}`] = {paddingLeft: calculatedWidth}
    classes[`pr-${key}`] = {paddingRight: calculatedWidth}
    classes[`px-${key}`] = {paddingHorizontal: calculatedWidth}

    classes[`m-${key}`] = {
      marginTop: calculatedHeight,
      marginBottom: calculatedHeight,
      marginRight: calculatedWidth,
      marginLeft: calculatedWidth
    }

    classes[`p-${key}`] = {
      paddingTop: calculatedHeight,
      paddingBottom: calculatedHeight,
      paddingRight: calculatedWidth,
      paddingLeft: calculatedWidth
    }
  })
  each(themeToApply['spacing'], (scale, key) => {
    classes[`b-${key}`] = {bottom: scale}
    classes[`t-${key}`] = {top: scale}
    classes[`l-${key}`] = {left: scale}
    classes[`r-${key}`] = {right: scale}
  })

  /**
   * Custom fonts (App related)
   */
  each(themeToApply['fonts'], (font, key) => {
    classes[`font-family-${key}`] = {fontFamily: font}
  })

  const finalTheme = defaultsDeep({}, fonts, styles, classes)
  return finalTheme
}
export {
  buildDefaults as defaults
}
