export default `query getLive($id: String!) {
    getLives(filter: { field: "_id", is: "=", value: $id }) {
      _id
      name
      purchased
      schedules(filters: { field: "current", is: "=" }) {
        _id
        name
        current
        purchased
        customJson
        opta
      }
      __typename
    }
  }
`
