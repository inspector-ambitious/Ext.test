/**
 * @class Ext.test.testSuite
 * TestSuite class
 * @extend Y.Test.Case
 * @author  Nicolas FERRERO (aka yhwh) for Sylogix
 * @version 1.0
 * @date	May 19, 2010
 */
Ext.test.testSuite = Ext.extend(Y.Test.Suite, {
    defaults: {},
    constructor: function(config) {
        Ext.apply(this, config);
        Ext.test.testSuite.superclass.constructor.apply(this, arguments);
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
   * Add a testCase or TestSuite to testSuite and register it in Ext.test.session
   * @param {Object} item The TestCase or the TestSuite configuration object 
   */
    add: function(item) {
        var it = item;
        if (! (item instanceof Y.Test.Case) && ! (item instanceof Y.Test.Suite)) {
            if (it.ttype == 'testsuite') {
                //~ item.parent = this;
                it = new Ext.test.testSuite(item);
            } else {
                it = new Y.Test.Case (item);
            }
        }
        Ext.test.testSuite.superclass.add.call(this, it);
        /* the testSuite is not empty so register it */
        Ext.test.session.registerSuite(this);
    }
});
