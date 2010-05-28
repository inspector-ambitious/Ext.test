/**
 * @class Ext.test.TestSuite
 * TestSuite class.
 * @extends Y.Test.Case
 * @author  Nicolas FERRERO (aka yhwh) for Sylogix
 * @version 1.1.1
 * @date	May 28, 2010
 */
Ext.test.TestSuite = Ext.extend(Y.Test.Suite, {
	/**
	 * @cfg {String} name (defaults to undefined) The TestSuite name.
	 */
	/**
	 * cfg {Array} items An array of TestCases, TestSuites, or config objects to initially
	 * add to this TestSuite.
	 */
	/**
	 * @cfg {Object} defaults (defaults to {}) The defaults methods or properties 
	 * to apply to children Ext.test.TestCase.
	 */
    defaults: {},
  /**
	 * @cfg {Ext.test.Session} testSession (defaults to Ext.test.session) The 
	 * default instanciated Ext.test.Session where the Ext.test.TestCase register.
	 */
    testSession: Ext.test.session,
    constructor: function(config) {
        Ext.apply(this, config);
        Ext.test.TestSuite.superclass.constructor.apply(this, arguments);
        if (this.parentSuite){
            this.testSession = this.parentSuite.testSession;
            this.testSession.addTestObject(this.parentSuite, this);
        } else {
            this.testSession.registerSuite(this);
        }
        this.initItems();
    },
	/** 
	 * Adds TestCases and/or TestSuites from an initial 'items' config.
	 * @private
	 */
    initItems: function() {
        var tcs = this.items.slice(0);
        this.items = [];
        if (tcs) {
            var len = tcs.length;
            var tc;
            for (var i = 0; i < len; i++) {
                tc = tcs[i];
                Ext.applyIf(tc, this.defaults);
                this.add(tc);
            }
        }
        console.log(this);
    },
	/**
	 * Adds an Ext.test.TestCase or Ext.test.TestSuite to this TestSuite, and
	 * registers it in the Ext.test.session.
	 * @param {Ext.test.TestCase|Ext.test.TestSuite|Object} item A TestCase, TestSuite, or configuration 
	 * object that represents the TestCase/TestSuite. 
	 */
    add: function(item) {
        var it = item;
            it.parentSuite = this;
        if (! (item instanceof Y.Test.Case) && ! (item instanceof Y.Test.Suite)) {
            if (it.ttype == 'testsuite') {
                it = new Ext.test.TestSuite(item);
            } else {
                it = new Y.Test.Case(item);
                this.testSession.addTestObject(this, it);
            }
        }
        Ext.test.TestSuite.superclass.add.call(this, it);
    },
	/**
	 * Gets the number of Ext.test.TestSuite's that will be run when this 
	 * Ext.test.TestSuite is run.
	 * @return {Number} The number of TestSuites.
	 */
    getTestSuiteCount: function(){
        var items = this.items,
            len = items.length,
            c = 0,
            it;
        for (var i = 0; i < len; i++){
            it = items[i];
            if (it instanceof Ext.test.TestSuite){
                c += it.getTestSuiteCount() + 1;
            }
        }
        return c;
    },
	/**
	 * Gets the number of Ext.test.TestCase's that will be run when this 
	 * Ext.test.TestSuite is run.
	 * @return {Number} The number of TestCases
	 */
    getTestCaseCount: function(){
        var items = this.items,
            len = items.length,
            c = 0,
            it;
        for (var i = 0; i < len; i++){
            it = items[i];
            if (it instanceof Y.Test.Case){
                c++;
            } else if (it instanceof Ext.test.TestSuite){
                c += it.getTestCaseCount();
            }
        }
        return c;
    }
});
