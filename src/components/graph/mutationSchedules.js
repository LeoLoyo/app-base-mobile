export default `
mutation scheduleProfile($id: String!) {
    profile {
      schedule (
        _id: $id
      ) {
        _id scheduled
      }
    }
}
`
