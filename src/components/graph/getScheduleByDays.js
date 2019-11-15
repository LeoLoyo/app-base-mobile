export default `
query getSchedulesByDay($days: Int = 30, $utc: Int = 0) {
  getSchedulesByDay(days: $days, utcDiff: $utc) {
    _id
    date
    schedules {
      _id
      name
      title: name
      description
      date_start
      date_recorded: date_start
      date_end
      customJson
      current
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
}
`
