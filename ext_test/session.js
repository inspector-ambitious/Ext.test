/**
 * @class Ext.test.Session
 * The Test Session Class. 
 * @extends Ext.util.Observable
 * @author  Nicolas FERRERO (aka yhwh) for Sylogix
 * @version 1.1
 * @date	May 21, 2010
 */
Ext.test.Session = Ext.extend(Ext.util.Observable, {
   /**
     * @property ts
     * A MixedCollection of instancied Ext.test.TestSuites.
     * @type Ext.util.MixedCollection
     */
    ts: new Ext.util.MixedCollection(),
   /**
     * @property tc
     * A MixedCollection of instancied Ext.test.TestCases.
     * @type Ext.util.MixedCollection
     */
    tc: new Ext.util.MixedCollection(),
    // adding some events
    constructor: function() {
        Ext.test.Session.superclass.constructor.apply(this, arguments);
        this.addEvents('registersuite', 'registercase');
    },
  /**
   * Get an existing Ext.test.TestSuite or create it if it doesn't exist.
   * @param {String} name The name of the Ext.test.TestSuite
   * @return {Ext.test.TestSuite} The Ext.test.TestSuite
   */
    getSuite: function(name) {
        var t = this.findSuite(name);
        if (!t) {
            t = this.createSuite(name);
        }
        return t;
    },
  /**
   * Create an Ext.testtestSuite.
   * @param {String} name The name of the Ext.test.TestSuite
   * @return {Ext.test.TestSuite} The Ext.test.TestSuite
   */
    createSuite: function(name) {
        return new Ext.test.TestSuite({
            name: name
        });
    },
  /**
   * Find an Ext.test.TestSuite by this name.
   * @param {String} name The name of the Ext.test.TestSuite
   * @return {Ext.test.TestSuite} The Ext.test.TestSuite
   */
    findSuite: function(name) {
        return this.ts.get(name);
    },
  /**
   * Register an Ext.test.TestSuite into this session.
   * @param {Ext.test.TestSuite} testSuite The Ext.test.TestSuite to register
   */
    registerSuite: function(testSuite) {
        var name = testSuite.name;
        if (this.ts.indexOf(name) == -1) {
            this.ts.add(name, testSuite);
        }
        this.fireEvent('registersuite', this, testSuite);
    },
  /**
   * Register an Ext.testSuite into this session.
   * @param {Ext.test.Case} testCase The testcase to register
   */
    registerCase: function(testCase) {
        var name = testCase.name;
        if (this.tc.indexOf(name) == -1) {
            this.tc.add(name, testCase);
        }
        this.fireEvent('registercase', this, testCase);
    },
  /**
   * Find an Ext.test.TestCase by this name.
   * @param {String} name The name of the Ext.test.TestCase 
   * @return {Ext.test.TestCase} The Ext.test.TestCase
   */
    findCase: function(name) {
        return this.ts.get(name);
    },
  /**
   * Add a testCase to Ext.test.session.
   * @param {String} name The name of the Ext.test.TestSuite
   * @param {String} testCase The Ext.test.TestCase
   */
    addTest: function(name, testCase) {
        var testSuite = this.getSuite(name);
        testSuite.add(testCase);
    },
  /**
   * Get the number of registered Ext.test.TestCase in this Ext.test.session.
   * @return {Number} The number of Ext.test.TestCase
   */
    getTestCaseCount: function() {
        var c = 0;
        this.ts.each(function(t){
            c += t.getTestCaseCount();
        },this);
        c += this.tc.getCount();
        return c;
    },
   /**
   * Get the number of registered Ext.test.TestSuite in this Ext.test.session.
   * @return {Number} The number of testSuite
   */
    getTestSuiteCount: function() {
        var c = 0;
        this.ts.each(function(t){
            c += (t.getTestSuiteCount() + 1);
        },this);
        return c;
    }
});

Ext.test.session = new Ext.test.Session();
