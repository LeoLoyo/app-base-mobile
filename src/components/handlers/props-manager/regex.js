export const extractHighlights = text => {
  const normalPart = '[^\\[\\]]+' // Valid matches: '[JA!]', '[settings]'
  const highlightPart = '\\[[^\\[\\]]+\\]' // Valid matches: 'Solo Padres', 'Bem-vindo a CN'
  const partsPattern = new RegExp(
    `(?:${normalPart})|(?:${highlightPart})`,
    'g'
  )
  const highlightPattern = new RegExp(`^${highlightPart}$`)
  const parts = String(text).match(partsPattern) || []
  return {
    parts,
    highlightPattern
  }
}

export const replaceHightLights = (highlightPattern, parts, variables) => {
  let res = parts.reduce((acc, curr, ix) => {
    const highlight = !!curr.match(highlightPattern)
    if (highlight) {
      let replace = variables[curr.slice(1, -1)]
      return replace ? acc.concat(replace) : acc
    }
    return acc.concat(curr)
  }, '')
  return res
}

export const matchHightlight = (highlightPattern, parts = []) => {
  return parts.map(part => {
    const highlight = !!part.match(highlightPattern)
    return {
      highlight,
      text: highlight ? part.slice(1, -1) : part
    }
  })
}

export default extractHighlights
