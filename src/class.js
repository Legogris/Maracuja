// the most basic Class implementation, from Andrea Giamarchi: http://webreflection.blogspot.com/2010/01/better-javascript-classes.html
function Class(__proto__) {
    // define the "Class"
    // if the definition object has a constructor property
    var Class = __proto__.hasOwnProperty("constructor") ?
        __proto__.constructor :
        (__proto__.constructor = function () {}); //Emptyo constructor if the class has none
    Class.prototype = __proto__;
    return Class;
}
Class.prototype = Function.prototype;
