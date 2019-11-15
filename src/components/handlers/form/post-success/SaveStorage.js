import Storage from '../../../../core/Storage'
export const SaveInStorage = async (config, data, extra = {}, props) => {
  if (props.setStorage && props.setStorage.length) {
    return Storage.multiSet([props.setStorage])
  }
  return Promise.resolve(false)
}
