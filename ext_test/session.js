/**
 * @class Ext.test.Session
 * The Test Session Class 
 * @extend Ext.util.Observable
 * @author  Nicolas FERRERO (aka yhwh) for Sylogix
 * @version 1.0
 * @date	May 19, 2010
 */
Ext.test.Session = Ext.extend(Ext.util.Observable, {
    // create a MixedCollection of instancied TestSuites
    ts: new Ext.util.MixedCollection(),
    // create a MixedCollection of instancied TestCases
    tc: new Ext.util.MixedCollection(),
    // adding some events
    constructor: function() {
        Ext.test.Session.superclass.constructor.apply(this, arguments);
        this.addEvents('registersuite', 'registercase');
    },
    /**
   * Get an existing Test Suite or Create it if it doesn't exist
   * @param {String} name The name of the TestSuite
   * @return {Y.Test.Suite} return Y.Test.Suite
   */
    getSuite: function(name) {
        var t = this.findSuite(name);
        if (!t) {
            t = this.createSuite(name);
        }
        return t;
    },
    /**
   * Create a Test Suite
   * @param {String} name The name of the TestSuite
   * @return {Y.Test.Suite} return Y.Test.Suite created
   */
    createSuite: function(name) {
        return new Ext.test.testSuite({
            name: name
        });
    },
    /**
   * Find a Test Suite 
   * @param {String} name The name of the TestSuite
   * @return {Ext.test.testSuite} return Ext.test.testSuite
   */
    findSuite: function(name) {
        return this.ts.get(name);
    },
    /**
   * Register a Test suite in this session
   * @param {Ext.test.testSuite} testSuite the testsuite to register
   */
    registerSuite: function(testSuite) {
        var name = testSuite.name;
        if (this.ts.indexOf(name) != -1) {
            this.ts.add(name, testSuite);
        }
        this.fireEvent('registersuite', this, testSuite);
    },
    /**
   * Register a Test Case in this session
   * @param {Ext.test.Case} testCase the testcase to register
   */
    registerCase: function(testCase) {
        var name = testCase.name;
        if (this.tc.indexOf(name) == -1) {
            this.tc.add(name, testCase);
        }
        this.fireEvent('registercase', this, testCase);
    },
    /**
   * Find a Test Case
   * @param {String} name The name of the TestCase
   * @return {Ext.test.testCase} return Ext.test.testCase
   */
    findCase: function(name) {
        return this.ts.get(name);
    },
    /**
   * Add a testCase to Ext.test.session
   * @param {String} testSuiteName The name of the TestSuite
   * @param {String} testCase The TestCase
   */
    addTest: function(testSuiteName, testCase) {
        var testSuite = this.getSuite(testSuiteName);
        testSuite.add(testCase);
    }
});

Ext.test.session = new Ext.test.Session();
