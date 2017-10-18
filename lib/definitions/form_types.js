
const FORM_TYPES = {

    'search': {
        'text':['search', 'find'],
        'fields':[
            [1, 'search'],
        ],
        'field_range': [1, 2]
    },
    'register': {
        'text':['signup', 'sign up', 'register', 'create account'],
        'fields':[
            [.6, 'username'],
            [1.1, 'email'],
            [1.9, 'password'],
            [.4, 'agree'],
            [.2, 'promotional'],
            [.2, 'captcha'],
        ],
        'field_range': [3, 20]
    },
    'login': {
        'text':['login', 'log in', 'sign in', 'signin'],
        'fields':[
            [.4, 'username'],
            [.7, 'email'],
            [1, 'password'],
            [.3, 'remember'],
        ],
        'field_range': [2, 4]
    },
    'subscribe': {
        'text':['subscribe',],
        'fields':[
            [1, 'email'],
        ],
        'field_range': [1, 2]
    },
    'address': {
        'text':['address'],
        'fields':[
            [1, 'first_name'],
            [1, 'last_name'],
            [1, 'address_1'],
            [.6, 'address_2'],
            [1, 'city'],
            [1, 'state'],
            [1, 'zipcode'],
            [.5, 'email'],
            [.5, 'phone'],
        ],
        'field_range': [5, 15]
    },
    'credit_card': {
        'text':['credit card'],
        'fields':[
            [.5, 'full_name'],
            [.5, 'first_name'],
            [.5, 'last_name'],
            [1, 'card_brand'],
            [1, 'card_number'],
            [1, 'card_expiration'],
            [1, 'card_verification'],
        ],
        'field_range': [3, 8]
    },
    'payment': {
        'text':['billing', 'creditcard', 'credit card', 'payment', 'purchase'],
        'fields':[
            [.7, 'full_name'],
            [.6, 'first_name'],
            [.6, 'last_name'],
            [.5, 'address_1'],
            [.5, 'address_2'],
            [.5, 'city'],
            [.5, 'state'],
            [.8, 'zipcode'],
            [.5, 'email'],
            [.5, 'phone'],
            [1, 'card_brand'],
            [1, 'card_number'],
            [1, 'card_expiration'],
            [1, 'card_verification'],
        ],
        'field_range': [5, 25]
    }
}

function getAllDataTypesForFormType(form_type) {
  if (form_type == null || form_type == 'custom') {
    return []
  }
  let datatypes = [];
  if (FORM_TYPES.hasOwnProperty(form_type)) {
    FORM_TYPES[form_type]['fields'].forEach(function(elem) {
        let [weight, dtype] = elem;
      datatypes = datatypes.concat(getAllDataTypesForFormType(dtype));
     });
  } else {
    datatypes.push(form_type);
  }
  return datatypes
}

