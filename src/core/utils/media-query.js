const {reduce} = require('lodash')

// inspectStyles('ios', {
//   'time-limit-icon': {
//     'fontSize': '80rem',
//     'color': 'white',
//     'alignSelf': 'center'
//   },
//   'cnya-text': {
//     'fontSize': 10,
//     '@media ios': {
//       'paddingTop': 10
//     },
//     '@media android': {
//       'marginTop': 20
//     }
//   }
// })

const inspectStyles = (os, classes) => {
  const resolved = reduce(classes, (acc, current, index) => {
    acc[index] = reduce(current, (style, rule, key) => {
      if (key.indexOf('@media') === 0) { // whenever a rule matches with @media
        // whenever an OS specific style applies, e.g: @media [android | ios]
        if (key.substr(7, key.length) === os) {
          style = Object.assign({}, style, rule)
        }
      } else {
        style[key] = rule
      }
      return style
    }, {})
    return acc
  }, {})
  return resolved
}
export {
  inspectStyles
}
