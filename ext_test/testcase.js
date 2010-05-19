/**
 * @class Ext.test.testCase
 * TestCase class
 * @extend Y.Test.Case
 * @author  Nicolas FERRERO (aka yhwh) for Sylogix
 * @version 1.0
 * @date	May 19, 2010
 */
Ext.test.testCase = Ext.extend(Y.Test.Case, {
    /**
	 * @cfg {Boolean} autoReg (defaults to false) Automatically register Ext.test.TestCase in Ext.test.session
	 */
    autoReg: false,
    constructor: function() {
        Ext.test.testCase.superclass.constructor.apply(this, arguments);
        if (this.autoReg) {
            Ext.test.session.registerCase(this);
        }
    }
});
