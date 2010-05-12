/**
 * @class Ext.test.testCase
 * TestCase class
 * @extend Y.Test.Case
 * @author  Nicolas FERRERO (aka yhwh) for Sylogix
 * @version 0.6
 * @date	May 11, 2010
 */
Ext.test.testCase = Ext.extend(Y.Test.Case,{
  /**
   * Register Test Case in Ext.test.session
   * creating testSuite if needed
   */	
  register : function(){
	 this.testSuite = Ext.test.session.getSuite(this.testSuiteName);
	 this.testSuite.add(this);
	 return this;
  }
});
