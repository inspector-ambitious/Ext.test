// Current ExtJs Unit Test are based on YUI 2.8 
var Y = YAHOO.util;
// Some hooks 
Y.Test = {
    Format: YAHOO.tool.TestFormat,
    Manager: YAHOO.tool.TestManager,
    Runner: YAHOO.tool.TestRunner,
    Case: YAHOO.tool.TestCase,
    Logger: YAHOO.tool.TestLogger,
    Reporter: YAHOO.tool.TestReporter,
    Suite: YAHOO.tool.TestSuite
};
/** 
 * Asserts that all properties in the object exist in another object.
 * Note: ObjectAssert.hasKeys is not implemented in YUI 2.8
 * I'am not sure this implementation is correct, because in Direct.js 
 * (Ext 3.2.1) unit test this method seems to have 4 arguments.
 * @param {Object} actual An object with the actual properties.
 * @param {Mixed} keys An Array or an Object which contains expected key.
 * @param {String} message (Optional) The message to display if the assertion fails.
 */
Y.ObjectAssert.hasKeys = function(actual, keys, message) {
    if (!Ext.isArray(keys)) {
        var properties = [];
        for (var key in keys) {
            properties.push(key);
        }
        keys = properties;
    }
    var len = keys.length;
    for (var i = 0; i < len; i++) {
        key = keys[i];
        Y.ObjectAssert.hasProperty(key, actual, message);
    }
};
/** 
 * Asserts that all properties in the object exist and are the same 
 * (===) in another object.
 * Note: ObjectAssert.areEqual is not implemented in YUI 2.8
 * This method do not compare function!
 * @param {Object} expected An object with the expected properties.
 * @param {Object} actual An object with the actual properties.
 * @param {String} message (Optional) The message to display if the assertion fails.
 */
Y.ObjectAssert.areEqual = function(expected, actual, message) {
    for (var property in expected) {
        if (typeof actual[property] != 'function') {
            Y.Assert.areSame(expected[property], actual[property], message);
        }
    }
    for (var property in actual) {
        if (typeof actual[property] != 'function') {
            Y.Assert.areSame(actual[property], expected[property], message);
        }
    }
};
