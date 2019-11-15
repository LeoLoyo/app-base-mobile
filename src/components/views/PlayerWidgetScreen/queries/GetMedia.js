export default `query getMedia($id: String!) {
  getMedia(_id: $id) {
    _id
    title
    purchased
    opta
    __typename
  }
}
`
