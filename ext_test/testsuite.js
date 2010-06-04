/**
 * @class Ext.test.TestSuite
 * TestSuite class.
 * @extends Y.Test.Case
 * @author  Nicolas FERRERO (aka yhwh) for Sylogix
 * @version 1.3
 * @date	June 4, 2010
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
	/**
	 * @cfg {Ext.test.Session} testSession (defaults to Ext.test.session) The 
	 * default instanciated Ext.test.Session where the Ext.test.TestCase register.
	 */
    defaults: {},
    disableRegister: false,
    constructor: function(config) {
        Ext.apply(this, config);
        Ext.test.TestSuite.superclass.constructor.apply(this, arguments);
        this.testSession = this.testSession || Ext.test.session;  
        if (!this.parentSuite && !this.disableRegister) {
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
        if (! (item instanceof Ext.test.TestCase) && ! (item instanceof Ext.test.TestSuite)) {
            if (it.ttype == 'testsuite') {
                it = new Ext.test.TestSuite(item);
            } else {
                it = new Y.Test.Case(item);
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
            if (it instanceof Ext.test.TestCase){
                c++;
            } else if (it instanceof Ext.test.TestSuite){
                c += it.getTestCaseCount();
            }
        }
        return c;
    },
  /**
	 * Cascades down the Ext.test.TestSuite tree from this Ext.test.TestSuite, 
	 * calling the specified function with each item. 
	 * If the function returns false at any point, the cascade is stopped on that branch.
	 * @param {function} The function to call
	 * @param {Ext.test.TestSuite/Ext.test.TestCase}(optional) The scope (this reference) in which the function is executed. Defaults to the current TestObject.
	 */
    cascade: function(fn,scope){
        var items = this.items,
            len = items.length,
            it;
        scope = scope || this;
        var res = fn.call(scope, this);
        if (res == false){
          return;
        }
        for (var i = 0; i < len; i++){
            it = items[i];
            if (it instanceof Ext.test.TestSuite){
                res = it.cascade(fn,scope);
                if (res == false){
                  return;
                }
            } else {
              fn.call(scope,it);
            }
        }
    }
});
// Ext 3.2.1 Unit Tests Compatibility
Y.Test.Suite = Ext.test.TestSuite;
