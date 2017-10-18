
const EXTRACTABLE_TYPES = {
  total_amount: {
    keywords: ['total', 'total amount', 'total order amount', 'payment amount', 'amount', 'payment of'],
    inclusive_regex: /\$[0-9,]+(\.[0-9]{2})?/,
  },
  confirmation_number: {
    keywords: ['order number', 'confirmation number', 'payment number', 'order id', 'payment id',
               'confirmation code', 'order code', 'reference number', 'reference id', 'transaction number',
               'transaction id', 'order'],
    inclusive_regex: /\b[#]?\w{4,32}\b/
  },
}