import axios from 'axios'
const $get = (url, headers) => {
  return axios.get(url, {
    headers
  }).then((resp) => resp.data)
    .catch((err) => err)
}

const $post = (url, data, headers) => {
  return axios.post(url, data, {
    headers
  })
}

const listIntegrators = (...args) => $get(...args)

export {
  $get,
  $post,
  listIntegrators
}
