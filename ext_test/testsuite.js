/**
 * @class Ext.test.TestSuite
 * TestSuite class.
 * @extends Y.Test.Case
 * @author  Nicolas FERRERO (aka yhwh) for Sylogix
 * @version 1.0
 * @date	May 19, 2010
 */
Ext.test.TestSuite = Ext.extend(Y.Test.Suite, {
  /**
	 * @cfg {Object} defaults (defaults to {}) The defaults methods or properties 
	 * to apply to children Ext.test.TestCase.
	 */
    defaults: {},
    constructor: function(config) {
        Ext.apply(this, config);
        Ext.test.TestSuite.superclass.constructor.apply(this, arguments);
        this.initItems();
    },
    // add testCases or TestSuite to testSuite
    initItems: function() {
        var tcs = this.items;
        if (tcs) {
            var len = tcs.length;
            var tc;
            for (var i = 0; i < len; i++) {
                tc = tcs[i];
                Ext.apply(tc, this.defaults);
                this.add(tc);
            }
        }
    },
  /**
   * Add an Ext.test.TestCase or Ext.test.TestSuite to this Ext.test.TestSuite 
   * and register it in Ext.test.session.
   * @param {Ext.test.TestCase/Ext.test.TestSuite/object} item A TestCase or 
   * a TestSuite or a Configuration object. 
   */
    add: function(item) {
        var it = item;
        if (! (item instanceof Y.Test.Case) && ! (item instanceof Y.Test.Suite)) {
            if (it.ttype == 'testsuite') {
                it = new Ext.test.TestSuite(item);
            } else {
                it = new Y.Test.Case(item);
            }
        }
        Ext.test.TestSuite.superclass.add.call(this, it);
        /* the testSuite is not empty so register it */
        Ext.test.session.registerSuite(this);
    },
  /**
   * Get the number of Ext.test.TestSuite that will be run when this 
   * Ext.test.TestSuite is run.
   * @return {Number} The number of Ext.test.TestCase.
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
   * Get the number of Ext.test.TestCase that will be run when this 
   * Ext.test.TestSuite is run.
   * @return {Number} The number of Ext.test.TestCase
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
