/**
 * @class Ext.test.TestCase
 * TestCase class.
 * @extends Y.Test.Case
 * @author  Nicolas FERRERO (aka yhwh) for Sylogix
 * @version 1.3
 * @date	June 4, 2010
 */
Ext.test.TestCase = Ext.extend(Y.Test.Case, {
	/**
	 * @cfg {String} name (defaults to undefined) The TestCase name.
	 */
  /**
	 * @cfg {Ext.test.Session} testSession (defaults to Ext.test.session) The 
	 * default instanciated Ext.test.Session where the Ext.test.TestCase register.
	 */
    constructor: function(config) {
        Ext.apply(this, config);
        Ext.test.TestCase.superclass.constructor.apply(this, arguments);
        this.testSession = this.testSession || Ext.test.session;     
        if (!this.parentSuite) {
            this.testSession.registerCase(this);
        }
    }
});
// Ext 3.2.1 Unit Tests Compatibility
Y.Test.Case = Ext.test.TestCase;
