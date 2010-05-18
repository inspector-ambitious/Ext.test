/**
 * @class Ext.test.session
 * Generate an interface for running test
 * The UI is based on http://www.extjs.com/forum/showthread.php?68409-ExtJS-Unit-Testing-Experiment
 * without PieChart 
 * @singleton
 * @author  Nicolas FERRERO (aka yhwh) for Sylogix
 * @version 0.9f
 * @date	May 18, 2010
 */
Ext.test.session = {
    testCaseCount : 0
  , passText : 'Passed'
  , failText : 'Failed!' 
  // create a MixedCollection of instancied TestSuites
  , ts : new Ext.util.MixedCollection() 

  , rootNode : new Ext.tree.TreeNode({
          text: 'My Tests Session'
        , expanded: true
        //, uiProvider: Ext.ux.tree.ColumnNodeUIPlus
  })
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
      Ext.QuickTips.init();
      var testViewport = new Ext.Viewport({
          layout: 'border'
        , items: [{
                xtype       : 'columntreeplus'
              , region      : 'center'
              , useArrows   : true
              , header      : true
              , id          : 'test-tree'
              , height      : 350
              , autoScroll  : true
              , rootVisible : false
              , title : document.title
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
              , root:  this.rootNode
              , columns : [{
                    dataIndex : 'name'
                  , header    : 'Name'
                  , id        : 'name'
                  , width     : 300
                },{
                    dataIndex : 'state'
                  , header    : 'State'
                  , id        : 'state'
                  , renderer  : function(val) {
                     var color = '#000';
                      if (val == Ext.test.session.passText) {
                          color = "#00FF00";
                      }
                      else if (val == Ext.test.session.failText) {
                        color = '#FF0000';
                      }
                      return '<span style="color: '+color+';font-weight: bold;">' + val + '</span>';
                  }
                  , width     : 200
                },{
                    dataIndex : 'results'
                  , header    : 'Results'
                  , id        : 'results'
                  , width     : 200
                },{
                    dataIndex : 'details'
                  , id        : 'details'
                  , header    : 'Details'
                  , width     : 250
                  , renderer  : function(val) {
                      return '<span ext:qtip="'+val+'">' + val + '</span>';
                  }
              }]
          },{
              xtype       : 'panel'
            , region      : 'south'
            , split       : true
            , autoScroll  : true
            , id          : 'console-panel'
            , height      : 125
            , minSize     : 50       // defaults to 50
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
      Y.Test.Runner.subscribe("testsuitecomplete", this.onTestRunnerEvent);
  }

  // Reset all tests
  , resetNodes : function(){
      var attr, ui;
      this.rootNode.cascade(function(node){
        if (node != this.rootNode){
          attr = node.attributes;
          ui = node.ui;
          attr['results'] = '';
          attr['details'] = '';
          attr['state']   = '';
          if (attr['type'] == 'testSuite'){
            ui.setIconElClass('x-tree-node-icon');
          }
          ui.refreshNode();
        }
      }, this);
  }
  , getTestCaseCount : function(){
    var attr,
        count = 0;
    this.rootNode.cascade(function(node){
        attr = node.attributes;
        if (attr['type'] == 'testCase'){
          count++;
        }
     }, this);
     return count;
  }
  // Handle Start Button Click
  , onStart : function() {
      var sbut = Ext.getCmp('start-button');
      sbut.disable();
      var pbar = Ext.getCmp('progress-bar');
      this.testCaseCount = 0;
      this.resetNodes();
      this.initTestRunner();
  }
  // initialize test runner
  , initTestRunner : function() {
	    Y.Test.Runner.clear();
      this.rootNode.eachChild(function(node){
        attr = node.attributes;
        if (attr['type'] == 'testSuite'){
          var t = this.findTestSuite(attr.name);
          Y.Test.Runner.add((t));
        }
      }, this);
	    Y.Test.Runner.run();   
  }
  // Handle test runner events
  , onTestRunnerEvent : function(event){
      var node, 
          res;
      
      switch(event.type){
        case "fail":
            node = Ext.test.session.getTestCaseNode(event.testCase.name);
            node.attributes['state'] = Ext.test.session.failText;
            var rd = node.attributes['details'];
            var details = String.format('{0}{1}: {2}<br>', rd || '', event.testName, event.error.toString());
            node.attributes['details'] = details; 
            node.ui.refreshNode();
            break;
        case "testcasebegin":
            node = Ext.test.session.getTestCaseNode(event.testCase.name);
            node.attributes['state'] =  'Running...';
            node.ui.refreshNode();
            break;
        case "testcasecomplete":
            Ext.test.session.testCaseCount++;
            node = Ext.test.session.getTestCaseNode(event.testCase.name);
            var count = Ext.test.session.getTestCaseCount();
            var pbar = Ext.getCmp('progress-bar');
            var c = Ext.test.session.testCaseCount/count;
            pbar.updateProgress(c, Math.round(100*c)+'% completed...');
            res = event.results;
            if (res.failed === 0) {
              node.attributes['state'] = Ext.test.session.passText;
            } 
            node.attributes['results'] = String.format('Passed: {0}, Failed: {1}, Ignored: {2} ', res.passed, res.failed, res.ignored);
            node.ui.refreshNode();
            break;
        case "testsuitebegin":
            node = Ext.test.session.getTestSuiteNode(event.testSuite.name);
            node.ui.setIconElClass('testsuite-running');
            node.ui.refreshNode();
            break;
        case "testsuitecomplete":
            node = Ext.test.session.getTestSuiteNode(event.testSuite.name);
            res = event.results;
            if (res.passed === res.total){
              node.attributes['state'] = Ext.test.session.passText;
              node.ui.setIconElClass('testsuite-passed');
            }
            if (res.failed > 0){
              node.attributes['state'] = Ext.test.session.failText;
              node.ui.setIconElClass('testsuite-failed');
            }
            node.attributes['results'] = String.format('Passed: {0}, Failed: {1}, Ignored: {2} ', res.passed, res.failed, res.ignored);
            node.ui.refreshNode();
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
  , registerTestSuite : function(testSuite, testSuiteParent){
      var name = testSuite.name;
      if (this.ts.indexOf(name) == -1){
        Ext.test.session.ts.add(name, testSuite); 
      }
      var n = new Ext.tree.TreeNode({
           name      : name
         , uiProvider: Ext.ux.tree.ColumnNodeUIPlus
         , type      : 'testSuite'
         , state     : ''
         , results   : ''
         , details   : ''
      });
      var pnode = testSuiteParent ? this.getTestSuiteNode(testSuiteParent.name) : this.rootNode;
      pnode.appendChild(n);
  }
  // Add a Testcase to tree
  , registerTestCase : function(testCase, testSuite){
      var n = new Ext.tree.TreeNode({
            name       : testCase.name
          , uiProvider : Ext.ux.tree.ColumnNodeUIPlus
          , type       : 'testCase'
          , state      : 'Pending...' 
          , results    : ''
          , details    : ''
      });
      var testSuiteNode, 
          attr,
          name = testSuite.name;
      this.rootNode.cascade(function(node){
        attr = node.attributes;
        if (attr['type'] == 'testSuite' && attr['name'] == name){
          testSuiteNode = node;
          return false;
        }
      }, this);
      if (testSuiteNode){
        testSuiteNode.appendChild(n);
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
  // Retrieve a record by testCase Name
  , getTestCaseNode : function(name){
      var n,
          attr;
      Ext.test.session.rootNode.cascade(function(node){
        attr = node.attributes;
        if (attr['type'] == 'testCase' && attr['name'] == name){
          n = node;
          return false;
        }
      }, this);
      return n;
  }
  // Retrieve a record by testSuite Name
  , getTestSuiteNode : function(name){
      var n,
          attr;
      Ext.test.session.rootNode.cascade(function(node){
        attr = node.attributes;
        if (attr['type'] == 'testSuite' && attr['name'] == name){
          n = node;
          return false;
        }
      }, this);
      return n;
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
