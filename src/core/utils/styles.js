
import {Platform} from 'react-native'
import {defaults} from './defaults'
import {inspectStyles} from './media-query'

export const builder = (theme, styles, variables) => defaults(
  theme,
  inspectStyles(Platform.OS, styles),
  variables
)
