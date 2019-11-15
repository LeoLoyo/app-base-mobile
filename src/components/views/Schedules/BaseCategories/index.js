import React from 'react'
import PropTypes from 'prop-types'
import _isEmpty from 'lodash/isEmpty'

import { getCategortyBase } from '../../../graph'
import withQuery from '../../../../core/withQuery'

const converIdToIndex = (array) => array.reduce((prev, {_id, ...atrib}) => {
  return ({ ...prev, [ _id ]: atrib })
}, {})

const BaseCategories = React.memo(({ loading, data = {}, children }) => {
  const { getCategories } = data
  if (!getCategories && !loading) {
    console.warn(`Base Category is null check id`)
    return null
  }

  if (_isEmpty(getCategories) && !loading) {
    console.warn(`Base Category is empty`)
    return null
  }
  if (getCategories && getCategories.length && !loading) {
    const baseCategories = converIdToIndex(getCategories)
    return children({ baseCategories })
  }
  return null
})

BaseCategories.displayName = `BaseCategories`

BaseCategories.getQuery = ({ variables, query = getCategortyBase }) => {
  return ({ query, variables })
}

BaseCategories.propTypes = {
  children: PropTypes.any,
  data: PropTypes.object,
  query: PropTypes.string,
  loading: PropTypes.bool,
  variables: PropTypes.object,
  policy: PropTypes.string
}

export default withQuery(BaseCategories)
