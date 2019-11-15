
// export type HighlightPart = {
//   text: string,
//   highlight: boolean,
// };

/**
 * Split the title into parts
 * Highlight parts are delimited by square brackets
 *
 * @param {string} text
 */
export const extractHighlights = (text) => {
  const normalPart = '[^\\[\\]]+' // Valid matches: '[JA!]', '[settings]'
  const highlightPart = '\\[[^\\[\\]]+\\]' // Valid matches: 'Solo Padres', 'Bem-vindo a CN'
  const partsPattern = new RegExp(`(?:${normalPart})|(?:${highlightPart})`, 'g')
  const highlightPattern = new RegExp(`^${highlightPart}$`)

  const parts = String(text).match(partsPattern) || []
  return parts.map((part) => {
    const highlight = !!part.match(highlightPattern)
    return {
      highlight,
      text: highlight ? part.slice(1, -1) : part
    }
  })
}

export default extractHighlights
