export default `query getPurchases {
    getPurchases {
      _id
      status
      cancelled
      amount
      tax
      valid_until
      currency_data {
        name
        symbol
      }
      payments {
        product_name
        amount
        gateway
        status
        invoice {
          number
          url
        }
        currency
        card {
          last4
          type
        }
      }
    }
  }`
