/**
 * @class Ext.test.session
 * Generate an interface for running test
 * The UI is based on http://www.extjs.com/forum/showthread.php?68409-ExtJS-Unit-Testing-Experiment
 * without PieChart 
 * @singleton
 * @author  Nicolas FERRERO (aka yhwh) for Sylogix
 * @version 0.7
 * @date	May 12, 2010
 */
Ext.test.session = {
    testCaseCount : 0
  // create a MixedCollection of instancied TestSuites
  , ts : new Ext.util.MixedCollection() 
  // Let's the action begin
  , boot : function() {
      Ext.onReady(Ext.test.session.init,this);
  }
  // Create interface and configure YUI TestRunner and Logger
  , init : function() {
      this.buildUI();
      this.configureYUI();
  }
  // Build Test Session interface
  , buildUI : function(){
      var testViewport = new Ext.Viewport({
          layout: 'border'
        , items: [{
                xtype : 'grid'
              , region : 'center'
              , id : 'test-grid'
              , autoExpandColumn : 'testName'
              , view : new Ext.grid.GroupingView({
                    forceFit       : true
                  , startCollapsed : true
              })
              , height : 350
              , store : Ext.test.Store
              , stripeRows : true
              , tbar: [
                  new Ext.Button({
                        text    : 'Start'
                      , iconCls : 'x-tbar-page-next'
                      , id      : 'start-button'
                      , handler : this.onStart
                      , scope   : this
                  })
              , '->'
              , new Ext.ProgressBar({
                   id   : 'progress-bar'
                  , text : 'Ready'
                  , width : 500
                })

              ]
              , columns : [{
                    dataIndex     : 'testSuite'
                  , header        : 'Test Suite'
                  , hidden        : true
                  , id            : 'testSuite'
                  , width         : 300
                  , groupRenderer : function(newValue, unused, rowRecord, rowIndex, colIndex, dataStore){
                      var groupCls = '';
                      var pending = false;
                      var testCount = 0;
                      var testPassed = 0;
                      dataStore.each(function(rec) {
                          if (newValue === rec.data.testSuite) {
                              testCount++;
                              if (!rec.data.testResult) {
                                  if (rec.data.testStatus === 'Pending...' || rec.data.testStatus === 'Running...' ) {
                                      pending = true;
                              }
                            } else if (rec.data.testStatus === 'Test failed!')  {
                                      groupCls = 'failed-test-group';
                            }
                            if (rec.data.testStatus === 'Test passed.'){
                              testPassed++; 
                            }
                          }
                      },this);

                      if (!pending && groupCls !== 'failed-test-group') {
                          groupCls = 'passed-test-group';
                      }
                      return String.format('<span class="{0}">&nbsp;{1}&nbsp;({2}/{3})</span>', groupCls, newValue, testPassed, testCount);
                  }
                },{
                    dataIndex : 'testName'
                  , header    : 'Name'
                  , id        :'testName'
                },{
                    dataIndex : 'testStatus'
                  , header    : 'Test Status'
                  , id        : 'testStatus'
                  , renderer  : function(val, cell, record) {
                         var color = '#000';
                          if (val == 'Test passed.') {
                              color = "#00FF00";
                          }
                          else if (val == 'Test failed!') {
                            color = '#FF0000';
                          }
                          return '<span style="color: '+color+'; font-weight: bold;">' + val + '</span>';
                  }
                  , width: 60
                },{
                    dataIndex: 'testResult'
                  , header: 'Results'
                  , id:'testResult'
                  , width: 100
                },{
                    dataIndex : 'testDetails'
                  , header    : 'Details'
                  , id        : 'testDetails'
                  ,width      : 200
              }]
          },{
              xtype       : 'panel'
            , region      : 'south'
            , split       : true
            , autoScroll  : true
            , id          : 'console-panel'
            , height      : 125
            , minSize     : 50       // defaults to 50
            , maxSize     : 200
            , header      : false
            , html        : '<div id="test_logger"></div>'
          }
      ]        
    });
    testViewport.show(); 
  }

  // Configure YUI Test Runner and attach events for further proccessing
  , configureYUI : function(){
      var testLogger = new Y.Test.Logger(Ext.get('test_logger').dom);
      //Y.Test.Runner.subscribe("begin", this.onTestRunnerEvent);
      Y.Test.Runner.subscribe("complete", this.onTestRunnerEvent);
      Y.Test.Runner.subscribe("fail", this.onTestRunnerEvent);
      //Y.Test.Runner.subscribe("ignore", this.onTestRunnerEvent);
      //Y.Test.Runner.subscribe("pass", this.onTestRunnerEvent);
      Y.Test.Runner.subscribe("testcasebegin", this.onTestRunnerEvent);
      Y.Test.Runner.subscribe("testcasecomplete", this.onTestRunnerEvent);
      Y.Test.Runner.subscribe("testsuitebegin", this.onTestRunnerEvent);
      //Y.Test.Runner.subscribe("testsuitecomplete", this.onTestRunnerEvent);
  }

  // Reset all tests
  , resetRecords : function(){
      var g = Ext.getCmp('test-grid');
      g.store.each(function(r){
        r.data['testStatus'] = 'Pending...';
        delete r.data['testResult'];
        delete r.data['testDetails'];
      });
      g.view.refresh();
  }
  // Handle Start Button Click
  , onStart : function() {
      var sbut = Ext.getCmp('start-button');
      sbut.disable();
      var pbar = Ext.getCmp('progress-bar');
      this.testCaseCount = 0;
      this.resetRecords();
      this.initTestRunner();
  }
  // initialize test runner
  , initTestRunner : function() {
	    Y.Test.Runner.clear();
	    var testSuites = [];
      Ext.test.Store.each(function(record){
        var testSuiteName = record.get('testSuite');
        if (testSuites.indexOf(testSuiteName) == -1){
          var testSuite = this.ts.get(testSuiteName);
          Y.Test.Runner.add((testSuite));
          testSuites.push(testSuiteName);
        }
	    },this);
	    Y.Test.Runner.run();   
  }
  // Handle test runner events
  , onTestRunnerEvent : function(event){
      var rec, 
          res;
      
      switch(event.type){
        case "fail":
            rec = Ext.test.session.getTestRecord(event.testCase.name);
            rec.set('testStatus', 'Test failed!');
            var rd = rec.get('testDetails');
            var details = String.format('{0}{1}: {2}<br>', rd || '', event.testName, event.error.toString());
            rec.set('testDetails', details); 
            rec.commit();
            break;
        case "testcasebegin":
            rec = Ext.test.session.getTestRecord(event.testCase.name);
            rec.set('testStatus', 'Running...');
            rec.commit();
            break;
        case "testcasecomplete":
            Ext.test.session.testCaseCount++;
            rec = Ext.test.session.getTestRecord(event.testCase.name);
            var count = Ext.test.Store.getCount();
            var pbar = Ext.getCmp('progress-bar');
            var c = Ext.test.session.testCaseCount/count;
            pbar.updateProgress(c, Math.round(100*c)+'% completed...');
            res = event.results;
            if (res.failed === 0) {
              rec.set('testStatus', 'Test passed.');
            } 
            rec.set('testResult', String.format('Passed: {0}, Failed: {1}, Ignored: {2} ', res.passed, res.failed, res.ignored));
            rec.commit();
            Ext.getCmp('test-grid').view.refresh();
            break;
            
        case "complete":
            var pbar = Ext.getCmp('progress-bar');
            pbar.updateProgress(1, '100% completed...');
            Ext.getCmp('start-button').enable();
            break;
      }
  }
  /*
   * Get an existing Test Suite or Create it if it doesn't exist
   * @param {String} testSuiteName The name of the TestSuite
   * @return {Y.Test.Suite} return Y.Test.Suite
   */
  , getSuite : function(testSuiteName) {
      var t = this.findTestSuite(testSuiteName);
      if (!t){
        t = this.createTestSuite(testSuiteName);
      }
      return t;
  }
  /**
   * Create a Test Suite
   * @param {String} testSuiteName The name of the TestSuite
   * @return {Y.Test.Suite} return Y.Test.Suite created
   */
  , createTestSuite : function(testSuiteName){
      return new Ext.test.testSuite({name: testSuiteName})
  }
  /**
   * Find a Test Suite 
   * @param {String} testSuiteName The name of the TestSuite
   * @return {Y.Test.Suite} return Y.Test.Suite
   */
  , findTestSuite : function(testSuiteName){
	    return this.ts.get(testSuiteName);
  }
  /**
   * Register a Test suite in this session
   * @param {Ext.test.testSuite} testSuite the testsuite to register
   */
  , registerTestSuite : function(testSuite){
      var name = testSuite.name;
      if (this.ts.indexOf(name) == -1){
        Ext.test.session.ts.add(name, testSuite); 
      }
  }
  /**
   * Find a Test Case
   * @param {String} testSuiteName The name of the TestSuite
   * @param {String} testCaseName The name of the TestCase
   * @return {Ext.test.testCase} return Ext.test.testCase
   */
  , findTestCase : function(testSuiteName, testCaseName){
	    var ts = this.findTestSuite(testSuiteName);
      var items = ts.items;
      var len = items.length;
      var item;
      for (var i = 0; i < len; i++){
          item = items[i];
          if (item.name == testCaseName){
          return item;	
          }
        }
  }
  // Add a Record containing testCase information
  , addRecord: function(testCase, testSuite){
      testSuite = testSuite || this;
      
      Ext.test.Store.addSorted(new Ext.test.Record({
         testName    : testCase.name
       , testSuite   : testSuite.name
       , testStatus  : 'Pending...' 
      }));
  }
  // Retrieve a record by testName
  , getTestRecord: function(testName){
      var idx = Ext.test.Store.findExact('testName',testName);
      return Ext.test.Store.getAt(idx);
  }
  /*
   * Add a testCase to Ext.test.session
   * @param {String} testSuiteName The name of the TestSuite
   * @param {String} testCase The TestCase
   */
  , addTest : function(testSuiteName,testCase){
      var testSuite = this.getSuite(testSuiteName);
      testSuite.add(testCase);
  }
};

Ext.test.session.boot();
