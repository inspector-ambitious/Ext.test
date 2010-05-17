/**
 * @class Ext.test.session
 * Generate an interface for running test
 * The UI is based on http://www.extjs.com/forum/showthread.php?68409-ExtJS-Unit-Testing-Experiment
 * without PieChart 
 * @singleton
 * @author  Nicolas FERRERO (aka yhwh) for Sylogix
 * @version 0.9c
 * @date	May 17, 2010
 */
Ext.test.session = {
    testCaseCount : 0
  // create a MixedCollection of instancied TestSuites
  , ts : new Ext.util.MixedCollection() 
  , rootNode : new Ext.tree.TreeNode({
          text: 'My Tests Session'
        , expanded: true
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
      var testViewport = new Ext.Viewport({
          layout: 'border'
        , items: [{
                xtype : 'columntree'
              , region : 'center'
              , header : true
              , id : 'test-tree'
              , height : 350
              , autoScroll : true
              , rootVisible : false
              , bbar: [
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
      Y.Test.Runner.subscribe("testsuitecomplete", this.onTestRunnerEvent);
  }

  // Reset all tests
  , resetNodes : function(){
      var attr,
          nattr,
          p;
      this.rootNode.cascade(function(node){
        attr = node.attributes;
        if (attr['type'] == 'testCase'){
          node.attributes['results'] = '';
          node.attributes['details'] = '';
          node.attributes['state'] = 'Pending...';
          nattr = Ext.apply({},node.attributes);
          p = node.parentNode;
          var expand = p.isExpanded();
          p.replaceChild(new Ext.tree.TreeNode(nattr), node);
          node.destroy();
          if (expand){
            p.expand(); 
          }
        }
        if (attr['type'] == 'testSuite'){
            ui = node.getUI();
            iconEl = ui.getIconEl();
            iconEl.className = 'x-tree-node-icon';
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
      this.ts.sort('ASC');
      this.ts.each(function(t){
        Y.Test.Runner.add((t));
      },this);
	    Y.Test.Runner.run();   
  }
  // Handle test runner events
  , onTestRunnerEvent : function(event){
      var node, 
          res;
      
      switch(event.type){
        case "fail":
            node = Ext.test.session.getTestCaseNode(event.testCase.name);
            node.attributes['state'] =  'Test failed!';
            var rd = node.attributes['details'];
            var details = String.format('{0}{1}: {2}<br>', rd || '', event.testName, event.error.toString());
            node.attributes['details'] = details; 
            break;
        case "testcasebegin":
            node = Ext.test.session.getTestCaseNode(event.testCase.name);
            node.attributes['state'] =  'Running...';
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
              node.attributes['state'] = 'Test passed.'
            } 
            node.attributes['results'] = String.format('Passed: {0}, Failed: {1}, Ignored: {2} ', res.passed, res.failed, res.ignored);
            break;
        case "testsuitecomplete":
            var tnode = Ext.test.session.getTestSuiteNode(event.testSuite.name);
            var ui = tnode.getUI();
            var iconEl = ui.getIconEl();
            if (event.results.passed === event.results.total){
              iconEl.className = 'testsuite-passed';
            }
            if (event.results.failed > 0){
              iconEl.className = 'testsuite-failed';
            }
            break;
        case "complete":
            var pbar = Ext.getCmp('progress-bar');
            pbar.updateProgress(1, '100% completed...');
            Ext.getCmp('start-button').enable();
            break;
      }
      if (node){
        var attr = Ext.apply({},node.attributes);
        var p = node.parentNode;
        var expand = p.isExpanded();
        p.replaceChild(new Ext.tree.TreeNode(attr), node);
        node.destroy();
        if (expand){
          p.expand(); 
        }
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
      var n = new Ext.tree.TreeNode({
           name      : name
         , uiProvider: Ext.ux.tree.ColumnNodeUI
         , type      : 'testSuite'
         , state     : ''
         , results   : ''
         , details   : ''
      });
      this.rootNode.appendChild(n);
  }
  // Add a Testcase to tree
  , registerTestCase : function(testCase, testSuite){
      var n = new Ext.tree.TreeNode({
            name       : testCase.name
          , uiProvider : Ext.ux.tree.ColumnNodeUI
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
