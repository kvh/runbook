
Array.prototype.sum = function() {
  return this.reduce((a, b) => a + b, 0)
}

Array.prototype.mean = function() {
  if (this.length == 0) return null;
  return this.sum() / this.length;
}

Array.prototype.max = function() {
  return Math.max.apply(null, this);
};

Array.prototype.min = function() {
  return Math.min.apply(null, this);
};

Array.prototype.any = function() {
  return this.reduce((a,b) => a || b, false);
};

Array.prototype.all = function() {
  return this.reduce((a,b) => a && b, true);
};


Array.prototype.intersection = function(other) {
  // Slow version
  return this.filter(x => other.indexOf(x) != -1);
};


function range(n) {
  return [...Array(n).keys()];
}
