
/**
 * Returns random color (needed for outline)
 * @returns {String}
 */
const getRandomColor = () => {
  let colors = [
    'black',
    'red',
    'green',
    'blue'
  ]
  let index = Math.round(Math.random() * (colors.length - 1))
  return colors[index]
}

export default getRandomColor
