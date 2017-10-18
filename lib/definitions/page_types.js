
// // # Account
// PAGE_LOGIN = 'page_login'
// PAGE_REGISTER = 'page_register'

// // # Shopping
// PAGE_BROWSE = 'page_browse'
// PAGE_ITEM = 'page_item'
// PAGE_CART = 'page_cart'
// PAGE_CHECKOUT = 'page_checkout'
// PAGE_PURCHASE = 'page_purchase'

// // # Other
// PAGE_SEARCH = 'page_search'
// PAGE_SUCCESS = 'page_success'
// PAGE_CATEGORY = 'page_category'
// PAGE_HOME = 'page_home'


var PAGE_TYPES = {}

// # Copy clickable keywords
for (type in CLICKABLE_TYPES) {
    if (CLICKABLE_TYPES.hasOwnProperty(type)) {
        PAGE_TYPES[type] = CLICKABLE_TYPES[type];
    }
}

// Not applicable
PAGE_TYPES['page_continue'] = null;
PAGE_TYPES['page_additem'] = null;

PAGE_TYPES.assign({
    'browse': ['shop for', 'browse'],
    'item': ['product', 'detail', 'item'],
    'category': ['category', 'categories', 'menu'],
    'success': ['success', 'confirmation', 'confirmed', 'receipt',],
    'home': ['home', 'index', 'homepage'],
})