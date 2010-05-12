/**
 * @class Ext.test.testSuite
 * TestSuite class
 * @extend Y.Test.Case
 * @author  Nicolas FERRERO (aka yhwh) for Sylogix
 * @version 0.7
 * @date	May 12, 2010
 */
Ext.test.testSuite = Ext.extend(Y.Test.Suite,{
    defaults: {}
  , constructor : function(){
      Ext.test.testSuite.superclass.constructor.apply(this, arguments);
      this.initTestCases(); 
      Ext.test.session.registerTestSuite(this);
  }
  // add testCases to testSuite
  , initTestCases : function() {
      var tcs = this.testCases;
      if (tcs) {
        var len = tcs.length;
        var tc;
        for (var i = 0; i < len; i++){
          tc = tcs[i];
          Ext.apply(tc, this.defaults);
          this.add(tc); 
        }
      }
  }
  /**
   * Add a testCase to testSuite and register it in Ext.test.session
   * @param {Object} testCase The TestCase configuration object 
   */
  , add : function(testCase){
      var t = testCase;
      if (!(testCase instanceof Ext.test.testCase)){
         t = new Ext.test.testCase(testCase);
      }
      Ext.test.testSuite.superclass.add.call(this, t);
      Ext.test.session.addRecord(testCase, this);
  }
});
