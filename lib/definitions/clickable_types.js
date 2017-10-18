
const CLICKABLE_TYPES = {
    'checkout': ['checkout', 'check out', 'purchase', 'order',],
    'cart': [
        'cart', 'my cart', 'view cart',
        'bag', 'my bag', 'view bag',
        'basket', 'my basket', 'view basket'],
    'login': ['signin', 'sign in', 'login', 'log in'],
    'register': ['register', 'create account', 'sign up', 'signup', 'join now', 'join today'],
    'logout': ['log out', 'logout', 'sign out',],
    'continue': ['next', 'continue', 'proceed', 'confirm', 'review order', 'start', 'begin'],
    'purchase': [
        'purchase', 'submit', 'order', 'submit order',
        'confirm order', 'confirm purchase', 'submit purchase'],
    'search': ['search','find'],
    'add_item': ['add to cart', 'buy', 'buy now'],
}


function getKeywordsForClass(klass) {
    return CLICKABLE_TYPES[klass];
}


if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  exports.getKeywordsForClass = getKeywordsForClass;
} else {
  window.getKeywordsForClass = getKeywordsForClass;
}