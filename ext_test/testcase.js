/**
 * @class Ext.test.TestCase
 * TestCase class.
 * @extends Y.Test.Case
 * @author  Nicolas FERRERO (aka yhwh) for Sylogix
 * @version 1.1
 * @date	May 21, 2010
 */
Ext.test.TestCase = Ext.extend(Y.Test.Case, {
  /**
	 * @cfg {Boolean} autoReg (defaults to false) Automatically register Ext.test.TestCase in Ext.test.session
	 */
    autoReg: false,
    constructor: function() {
        Ext.test.TestCase.superclass.constructor.apply(this, arguments);
        if (this.autoReg) {
            Ext.test.session.registerCase(this);
        }
    }
});
