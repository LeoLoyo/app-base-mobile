export default `
query getLives{
    getLives (sort: {field: "custom.order", dir: "asc"}){
      _id
      name
      purchased
      customJson
      schedules(filters: [{field: "current", is: "=", value: "true"}]) {
        _id
        name
        purchased
        customJson
      }
    }
  }
`
