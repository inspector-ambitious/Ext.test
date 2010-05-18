/**
 * @class Ext.test.testSuite
 * TestSuite class
 * @extend Y.Test.Case
 * @author  Nicolas FERRERO (aka yhwh) for Sylogix
 * @version 0.9f
 * @date	May 18, 2010
 */
Ext.test.testSuite = Ext.extend(Y.Test.Suite,{
    defaults : {}
  , parentTestSuite : undefined
  , constructor : function(config){
      Ext.apply(this, config);
      Ext.test.testSuite.superclass.constructor.apply(this, arguments);
      Ext.test.session.registerTestSuite(this, this.parentTestSuite);
      this.initItems(); 
  }
  // add testCases or TestSuite to testSuite
  , initItems : function() {
      var tcs = this.items;
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
   * Add a testCase or TestSuite to testSuite and register it in Ext.test.session
   * @param {Object} item The TestCase or the TestSuite configuration object 
   */
  , add : function(item){
      var it = item;
      if (!(item instanceof Ext.test.testCase) && !(item instanceof Ext.test.testSuite)){
         if (it.ttype == 'testsuite'){
          item.parentTestSuite = this;
          it = new Ext.test.testSuite(item);
        } else {
          it = new Ext.test.testCase(item);
        }
      }
      Ext.test.testSuite.superclass.add.call(this, it);
      
      if (it instanceof Y.Test.Case){
        Ext.test.session.registerTestCase(it, this);
      }
  }
});
