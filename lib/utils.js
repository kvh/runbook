let UUID_ATTR = 'data-rb-uuid'


function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
}


function generateStableUuid(el) {
    /*
        Tries to generate a stable unique identifier for a particular element, with focus
        on links and form inputs. Uses what should be unique text identifiers (input name,
        element id, etc) but also increments duplicates in order of appearance -- which
        should be DOM order, i.e. somewhat stable.
        TODO: truly ROBUST stable identifier -- i.e. what a human would be able to identify
        as the same element, regardless of code implementation.
    */
    let raw_id = '';
    if (el.tagName.toLowerCase() == 'a' || el.tagName.toLowerCase() == 'button') {
        raw_id = [el.tagName, el.id, el.href, el.innerText.substring(0,25)].join('|').toLowerCase();
    } else {
        raw_id = [el.tagName, el.type, el.id, el.name].join('|').toLowerCase();
    }
    let id = raw_id;
    let i = 1;
    // Increment until unique
    while (to_be_stored.hasOwnProperty(id)) {
        id = raw_id + i;
        i++;
    }
    return id;
}


function createUuid(el) {
    if (el.hasAttribute(UUID_ATTR)){
        return el.getAttribute(UUID_ATTR);
    }
    let uuid = generateStableUuid(el);
    el.setAttribute(UUID_ATTR, uuid);
    to_be_stored[uuid] = el;
    return uuid;
}


function getByUuid(uuid) {
    return to_be_stored[uuid];
}


function highlightElement(elem) {
    $(elem).css('border', 'solid 3px #8888ff');
}



if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  exports.createUuid = createUuid;
  exports.getByUuid = getByUuid;
  exports.highlightElement = highlightElement;
} else {
  window.createUuid = createUuid;
  window.getByUuid = getByUuid;
  window.highlightElement = highlightElement;
}