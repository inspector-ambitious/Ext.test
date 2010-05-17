/**
 * @class Ext.test.testCase
 * TestCase class
 * @extend Y.Test.Case
 * @author  Nicolas FERRERO (aka yhwh) for Sylogix
 * @version 0.9c
 * @date	May 17, 2010
 */
Ext.test.testCase = Ext.extend(Y.Test.Case,{
  /**
	 * @cfg {Boolean} autoReg (defaults to false) Automatically register Ext.test.TestCase in Ext.test.session
	 */
    autoReg : false
  ,	constructor : function(){
	    Ext.test.testCase.superclass.constructor.apply(this,arguments);
		  if (this.autoReg){
			  this.register();
	    }
  }
  /**
   * Register Test Case in Ext.test.session
   * creating testSuite if needed
   */	
  , register : function(){
	    this.testSuite = Ext.test.session.getSuite(this.testSuiteName);
	    this.testSuite.add(this);
	    return this;
  }
});
