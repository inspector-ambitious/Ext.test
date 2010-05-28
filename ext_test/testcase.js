/**
 * @class Ext.test.TestCase
 * TestCase class.
 * @extends Y.Test.Case
 * @author  Nicolas FERRERO (aka yhwh) for Sylogix
 * @version 1.1.1
 * @date	May 28, 2010
 */
Ext.test.TestCase = Ext.extend(Y.Test.Case, {
	/**
	 * @cfg {String} name (defaults to undefined) The TestCase name.
	 */
	/**
	 * @cfg {Boolean} autoReg (defaults to false) True to automatically register the 
	 * Ext.test.TestCase in the Ext.test.session.
	 */
    autoReg: false,
  /**
	 * @cfg {Ext.test.Session} testSession (defaults to Ext.test.session) The 
	 * default instanciated Ext.test.Session where the Ext.test.TestCase register.
	 */
    testSession: Ext.test.session,
    constructor: function() {
        Ext.test.TestCase.superclass.constructor.apply(this, arguments);      
        if (this.autoReg && this.testSession) {
            this.testSession.registerCase(this);
        }
    }
});
