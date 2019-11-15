export default `
query getCategories( $idParent: String!) {
  getCategories(filter:{field: "parent", is:"=", value: $idParent }){
      _id
      name
      customJson
      image
}
}
`
