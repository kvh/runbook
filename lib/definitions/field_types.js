
const FIELD_TYPES = {

   // Contact
  'email': {
    'names':['email', 'email address'],
    'field_configs':[{
      'config_key':'email1',
      'field_specs':[
        {'type':'text', 'length': [20,255]}
      ]
    },{
      'config_key':'email2',
      'field_specs':[
        {'type':'email'}
      ]
    }]
  },
  'phone': {
    'names':['phone', 'phone number', 'mobile', 'cell',
         'telephone', 'cellphone', 'mobile number'],
    'related':['number', 'home', 'work', 'country code'],
    'field_configs':[{
      'config_key':'phone1',
      'field_specs':[
        {'type':'text', 'length': [10,15]}
      ]
    }, {
      'config_key':'phone3',
      'field_specs':[
        {'type':'text', 'length': [3,3]},
        {'type':'text', 'length': [3,3]},
        {'type':'text', 'length': [4,4]}
      ]
    }]
  },

  // # Personal
  'password': {
    'names':['password', 'verfiy password', 'confirm password'],
    'related':['verify'],
    'field_configs':[{
      'config_key':'password1',
      'field_specs':[
        {'type':'password', 'length': [7,50]}
      ]
    }]
  },
  'username': {
    'names':['username', 'user name',
         // # 'email address or username', 'username or email address',
         // # 'email or username', 'username or email'],
         ],
    'field_configs':[{
      'config_key':'username1',
      'field_specs':[
        {'type':'text', 'length': [6,52]}
      ]
    }]
  },
  'birthdate': {
    'names':['birthdate', 'birthday', 'born on', 'day of birth', 'date of birth'],
    'field_configs':[{
      'config_key':'birthdate1',
      'field_specs':[
        {'type':'text', 'length': [8,12]},
      ]
    }, {
      'config_key':'birthdate2',
      'field_specs':[
        {'tag':'select', 'num_options':[12,13]},
        {'tag':'select', 'num_options':[28,33]},
        {'tag':'select', 'num_options':[40,150]}
      ]
    }]
  },
  'age': {
    'names':['age', 'your age', 'how old are you'],
    'field_configs':[{
      'config_key':'age1',
      'field_specs':[
        {'type':'text', 'length': [2,5]},
      ]
    }, {
      'config_key':'age2',
      'field_specs':[
        {'tag':'select', 'num_options':[20, 200]},
      ]
    }]
  },
  'gender': {
    'names': ['gender', 'sex'],
    'field_configs':[{
      'config_key':'gender1',
      'field_specs':[
        {'tag':'select', 'num_options': [2,3]},
      ]
    }, {
      'config_key':'gender2',
      'field_specs':[
        {'type':'radio', 'num_options':[2,3]},
      ]
    }]
  },

  // Thing fields (Address, card, plates, ...)
  'full_name': {
    'names': ['name', 'full name',],
    'related': ['name',],
    'field_configs':[{
      'config_key':'full_name1',
      'field_specs':[
        {'type':'text', 'length': [20,255]}
      ]
    }]
  },
  'first_name': {
    'names': ['first name', 'first'],
    'field_configs':[{
      'config_key':'first_name1',
      'field_specs':[
        {'type':'text', 'length': [10,255]}
      ]
    }]
  },
  'middle_name': {
    'names': ['middle name'],
    'field_configs':[{
      'config_key':'middle_name1',
      'field_specs':[
        {'type':'text', 'length': [10,255]}
      ]
    }]
  },
  'middle_initial': {
    'names': ['middle initial', 'middle'],
    'field_configs':[{
      'config_key':'middle_name2',
      'field_specs':[
        {'type':'text', 'length': [1,1]}
      ]
    }]
  },
  'last_name': {
    'names': ['last name', 'last'],
    'field_configs':[{
      'config_key':'last_name1',
      'field_specs':[
        {'type':'text', 'length': [10,255]}
      ]
    }]
  },
  'address_1': {
    'names': ['address', 'address 1', 'Street address P.O. box company name c/o'],
    'related': ['Street address', 'P.O. box', 'company name c/o'],
    'field_configs':[{
      'config_key':'address_1',
      'field_specs':[
        {'type':'text', 'length': [20,255]}
      ]
    }]
  },
  'address_2': {
    'names': ['address 2', 'address second', 'Apartment suite unit building floor'],
    'related': ['Apartment', 'suite', 'unit', 'building', 'floor'],
    'field_configs':[{
      'config_key':'address_2',
      'field_specs':[
        {'type':'text', 'length': [20,255]}
      ]
    }]
  },
  'city': {
    'names': ['city'],
    'field_configs':[{
      'config_key':'city1',
      'field_specs':[
        {'type':'text', 'length': [20,255]}
      ]
    }]
  },
  'state': {
    'names': ['state', 'province', 'state province'],
    'field_configs':[{
      'config_key':'state1',
      'field_specs':[
        {'type':'text', 'length': [2,50]}
      ]
    },{
      'config_key':'state2',
      'field_specs':[
        {'tag':'select', 'num_options':[48,60]}
      ]
    }
    ]
  },
  'zipcode': {
    'names': ['zip', 'zipcode', 'postal code'],
    'field_configs':[{
      'config_key':'zip1',
      'field_specs':[
        {'type':'text', 'length': [5,10]}
      ]
    }]
  },
  'country': {
    'names': ['country',],
    'field_configs':[{
      'config_key':'country_text',
      'field_specs':[
        {'type':'text', 'length': [20,52]}
      ]
    },{
      'config_key':'country_select',
      'field_specs':[
        {'tag':'select', 'num_options':[60, 400]}
      ]
    }
    ]
  },

  // Cards
  'card_brand': {
    'names': ['card type', 'credit card type', 'card brand', 'visa mastercard'],
    'related': ['visa', 'mastercard', 'discover', 'amex'],
    'field_configs':[{
      'config_key':'card_brand1',
      'field_specs':[
        {'tag':'select', 'num_options': [2,5]}
      ]
    },{
      'config_key':'card_brand4',
      'field_specs':[
        {'type':'radio', 'num_options':[2,6]},
      ]
    }]
  },
  'card_number': {
    'names': ['card number', 'credit card number', 'credit card'],
    'related': ['number',],
    'field_configs':[{
      'config_key':'card_number1',
      'field_specs':[
        {'type':'text', 'length': [16,20]}
      ]
    }]
  },
  'card_expiration': {
    'names':['expiration date', 'expiration', 'expires'],
    'field_configs':[{
      'config_key':'card_expiration1',
      'field_specs':[
        {'type':'text', 'length': [2,2]},
        {'type':'text', 'length': [2,4]}
      ]
    }, {
      'config_key':'card_expiration2',
      'field_specs':[
        {'tag':'select', 'num_options':[12,13]},
        {'tag':'select', 'num_options':[5,50]}
      ]
    }]
  },
  'card_verification': {
    'names': ['cvv', 'cvc', 'cvv2', 'code', 'security code', 'card verification', 'verfication'],
    'related': ['code',],
    'field_configs':[{
      'config_key':'card_verification',
      'field_specs':[
        {'type':'text', 'length': [3,3]}
      ]
    }]
  },

  // License, no, too specific...
  // 'license_plate_number': {
  //   'names': ['license plate', 'plate', 'license plate number', 'plate number'],
  //   'related': ['code',],
  //   'field_configs':[{
  //     'config_key':'card_verification',
  //     'field_specs':[
  //       {'type':'text', 'length': [3,3]}
  //     ]
  //   }]
  // },
  // 'card_verification': {
  //   'names': ['cvv', 'cvc', 'cvv2', 'code', 'security code', 'card verification', 'verfication'],
  //   'related': ['code',],
  //   'field_configs':[{
  //     'config_key':'card_verification',
  //     'field_specs':[
  //       {'type':'text', 'length': [3,3]}
  //     ]
  //   }]
  // },

  // # Account
  'agree': {
    'names': ['agree to terms', 'terms of service', 'i agree to', 'yes i agree to' ],
    'related': ['read and agree to', 'privacy policy'],
    'field_configs':[{
      'config_key':'agree',
      'field_specs':[
        {'type':'checkbox'}
      ]
    }]
  },
  'remember': {
    'names': ['remember', 'remember me', 'stay logged in', 'keep me logged in' ],
    'related': [],
    'field_configs':[{
      'config_key':'remember',
      'field_specs':[
        {'type':'checkbox'}
      ]
    }]
  },
  'captcha': {
    'names': ['captcha', 'enter characters', 'type the words', 'type the code', 'enter the words', 'enter the text', 'enter text',
          'type the characters', 'code in the image', 'text in the image',],
    'related': [],
    'field_configs':[{
      'config_key':'captcha',
      'field_specs':[
        {'type':'text'}
      ]
    }]
  },
  'promotional': {
    'names': ['optin', 'optout', 'send me offers', 'promotional', 'send me promotions', 'please send me', 'i d like to receive',
          'i d like to be contacted', 'yes i d like to', 'yes please send me', 'i would like to'],
    'related': [],
    'field_configs':[{
      'config_key':'remember',
      'field_specs':[
        {'type':'checkbox'}
      ]
    }]
  },


  // # Search and Filter
  'search': {
    'names': ['search', 'find', 'q'],
    'field_configs':[{
      'config_key':'search1',
      'field_specs':[
        {'type':'text', 'length': [20,255]}
      ]
    }]
  },

  // # Actions
  'submit': {
    'names': ['submit', 'next', 'continue', 'add', 'create',
          'sign up', 'log in', 'sign in', 'register', 'go'],
    'field_configs':[{
      'config_key':'submit1',
      'field_specs':[
        {'type':'submit'}
      ]
    },{
      'config_key':'submit2',
      'field_specs':[
        {'tag':'button'}
      ]
    }]
  },
  'cancel': {
    'names': ['cancel', 'back', 'previous'],
    'field_configs':[{
      'config_key':'cancel1',
      'field_specs':[
        {'type':'submit'}
      ]
    },{
      'config_key':'cancel2',
      'field_specs':[
        {'tag':'button'}
      ]
    }]
  }
}

function getFieldType(key) {
  return FIELD_TYPES[key];
}

function isFieldType(key) {
  return FIELD_TYPES.hasOwnProperty(key);
}

function getAllFieldTypes() {
  return Object.getOwnPropertyNames(FIELD_TYPES)
}



if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  exports.getFieldType = getFieldType;
  exports.isFieldType = isFieldType;
  exports.getAllFieldTypes = getAllFieldTypes;
} else {
  window.getFieldType = getFieldType;
  window.isFieldType = isFieldType;
  window.getAllFieldTypes = getAllFieldTypes;
}
