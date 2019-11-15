export default `
query getSchedules(
  $filters: [Filter] = [{
    field: "not_selleable",
    is: "!="
    operator: AND
  },{
    field: "is_featured",
    is: "="
    operator: AND
  }
],
  $days: Int = 1
)
{
  getSchedules(filters: $filters, days: $days) {
    _id
    name
    title: name
    description
    date_start
    date_end
    current
    customJson
    purchased
    scheduled
    live {
      _id
      name
      purchased
      customJson
    }
  }
}
`
