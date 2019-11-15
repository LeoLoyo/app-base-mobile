import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import _merge from 'lodash/merge'
import _get from 'lodash/get'
import _find from 'lodash/find'
import _has from 'lodash/has'
import _reduce from 'lodash/reduce'
import _set from 'lodash/set'
import TitleGridExplorer from './Title'
import ListCategoriesExplorer from './List'
import GridDataExplorer from './Grid'
import { CustomComponentProvider } from '../../../core/withCustomComponent'
import withQuery from '../../../core/withQuery'

class GridExplorer extends Component {
  state = {
    active: 0
  };

  selectCategory = ({ index, _id: idCategory }) => this.setState({ active: index, idCategory })

  _renderTitle = props => (<TitleGridExplorer {...props} />)

  _renderCategories = props => {
    const { responseName } = this.props
    const data = _get(this.props, responseName, [])

    return (
      <ListCategoriesExplorer
        {..._merge({}, props, {
          itemProps: {
            active: this.state.active,
            onPress: this.selectCategory
          }
        })} data={data}/>
    )
  }

  _renderGrid = props => {
    const { idCategory, active: indexActive } = this.state
    const { responseName, gridDataProps } = this.props

    const data = _get(this.props, responseName, [])
    const categorySelected = _find(data, ['_id', idCategory]) || data[indexActive] || null

    let dynamiProps = gridDataProps

    if (categorySelected && _has(gridDataProps, 'variables') && _has(gridDataProps, 'fieldToSearch')) {
      const ouput = _reduce(gridDataProps.fieldToSearch, (prev, curr) => {
        return _set(prev, curr.to, _get(categorySelected, curr.from))
      }, {})
      dynamiProps = _merge({}, gridDataProps, ouput)
    }

    return (<GridDataExplorer {...dynamiProps} {...categorySelected} />)
  }
  _renderComponent = (ElementComponent) => (
    <CustomComponentProvider {...this.props} components={[ElementComponent]}>
      { ({[ElementComponent]: Component}) => Component ? <Component {...this.props}/> : null }
    </CustomComponentProvider>
  )
  render () {
    const {
      hasTitle,
      titleProps,
      hasCategories,
      categoriesProps,
      hasData,
      gridDataProps
    } = this.props
    if (this.props.loading) return this._renderComponent('LoaderComponent')
    if (this.props.error) return this._renderComponent('ErrorComponent')
    return (
      <Fragment key='gridExplore'>
        { hasTitle && this._renderTitle(titleProps) }
        { hasCategories && this._renderCategories(categoriesProps) }
        { hasData && this._renderGrid(gridDataProps) }
      </Fragment>
    )
  }
}

GridExplorer.propTypes = {
  error: PropTypes.any,
  hasTitle: PropTypes.bool,
  hasCategories: PropTypes.bool,
  data: PropTypes.any,
  responseName: PropTypes.string,
  hasData: PropTypes.bool,
  titleProps: PropTypes.object,
  categoriesProps: PropTypes.object,
  gridDataProps: PropTypes.object,
  loading: PropTypes.any
}

GridExplorer.defaultProps = {
  hasTitle: true,
  hasCategories: true,
  hasData: true,
  titleProps: {},
  categoriesProps: {},
  gridDataProps: {}
}

export default withQuery(GridExplorer)
