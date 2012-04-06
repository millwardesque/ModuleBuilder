if (typeof Object.create !== "function") {
  /**
   * Helper function for creating a new object from another
   * Taken from http://javascript.crockford.com/prototypal.html
   * 
   * @param obj
   *   The object to use as a base-class
   *
   * @return The new object that inherits from obj
   */
  Object.create = function(obj) {
    function F() { };
    F.prototype = obj;
    return new F();
  }
}