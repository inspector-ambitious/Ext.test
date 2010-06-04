/**
 * @class Ext.test.view.ColumnTree
 * A ColumnTree that show test registered in Ext.test.session. 
 * Based on Ext.ux.tree.ColumnTree sample.
 * @extends Ext.tree.TreePanel
 * @author  Nicolas FERRERO (aka yhwh) for Sylogix
 * @version 1.3
 * @date	June 4, 2010
 */
Ext.test.view.ColumnTree = Ext.extend(Ext.tree.TreePanel, {
    useArrows: true,
    header: true,
    passText: 'Passed',
    failText: 'Failed!',
    autoScroll: true,
    rootVisible: false,
    lines : false,
  /**
	 * @cfg {Ext.test.Session} testSession (defaults to Ext.test.session) The 
	 * default instanciated Ext.test.Session used by this Ext.test.runner.
	 */
    borderWidth : Ext.isBorderBox ? 0 : 2, // the combined left/right border for each cell
    cls : 'x-column-tree',
    initComponent: function() {
        this.testSession = this.testSession || Ext.test.session;  
        this.createRootNode();
        this.configureColumns();
        this.monitorTestRunner();
        Ext.test.view.ColumnTree.superclass.initComponent.apply(this, arguments);
    },
    // Create tree root node
    createRootNode: function() {
         this.root = new Ext.tree.TreeNode({
            expanded: true
        });
    },
    // configure columns
    configureColumns: function() {
        this.columns = [{
            dataIndex: 'name',
            header: 'Name',
            id: 'name',
            width: 300,
            renderer: function(val, node) {
                var qtip = '';
                var err = node.attributes['errors'];
                if (err != '') {
                    qtip = 'ext:qtip="' + err + '"';
                }
                return '<span '+qtip+'>' + val + '</span>';
            }
        }, {
            dataIndex: 'state',
            header: 'State',
            id: 'state',
            renderer: function(val, node) {
                var color = '#000';
                if (val == node.ownerTree.passText) {
                    color = "#00FF00";
                } else if (val == node.ownerTree.failText) {
                    color = '#FF0000';
                }
                return '<span style="color: ' + color + ';font-weight: bold;">' + val + '</span>';
            },
            width: 200
        }, {
            dataIndex: 'passed',
            header: 'Passed',
            width: 50
        }, {
            dataIndex: 'failed',
            header: 'Failed',
            width: 50
        }, {
            dataIndex: 'ignored',
            header: 'Ignored',
            width: 50
        }];
    },
    // monitor test runner
    monitorTestRunner: function(){
        var fn = this.onTestRunnerEvent;
        var r = Ext.test.runner;
        this.mon(r, 'begin', fn, this);
        this.mon(r, 'complete', fn, this);
        this.mon(r, 'fail', fn, this);
        this.mon(r, 'pass', fn, this);
        this.mon(r, 'ignore', fn, this);
        this.mon(r, 'testcasebegin', fn, this);
        this.mon(r, 'testcasecomplete', fn, this);
        this.mon(r, 'testsuitebegin', fn, this);
        this.mon(r, 'testsuitecomplete', fn, this);
        this.mon(r, 'beforebegin', this.resetNodes, this);
    },
    // See columnTree example for this
    onRender: function() {
        Ext.test.view.ColumnTree.superclass.onRender.apply(this, arguments);
        this.colheaders = this.bwrap.createChild({
            cls: 'x-tree-headers'
        }, this.bwrap.dom.lastChild);
        var cols = this.columns,
        c;
        for (var i = 0, len = cols.length; i < len; i++) {
            c = cols[i];
            this.colheaders.createChild({
                cls: 'x-tree-hd ' + (c.cls ? c.cls + '-hd': ''),
                cn: {
                    cls: 'x-tree-hd-text',
                    html: c.header
                },
                style: 'width:' + (c.width - this.borderWidth) + 'px;'
            });
        }
        this.colheaders.createChild({
            cls: 'x-clear'
        });
        // prevent floats from wrapping when clipped
        this.colheaders.setWidth('auto');
        this.createTree();
    },
	/**
	 * Gets an Ext.test.TestCase node by its name.
	 * @param {String} name The name of the Ext.test.TestCase
	 * @return {Ext.tree.TreeNode} The node, or undefined.
	 */
    getCaseNode: function(name) {
        var n,
        attr;
        this.root.cascade(function(node) {
            attr = node.attributes;
            if (attr['type'] == 'testCase' && attr['name'] == name) {
                n = node;
                return false;
            }
        }, this);
        return n;
    },
	/**
	 * Gets a TestSuite node by its name.
	 * @param {String} name The name of the TestSuite
	 * @return {Ext.tree.TreeNode} The Ext.tree.TreeNode, or undefined
	 */
    getSuiteNode: function(name) {
        var n,
        attr;
        this.root.cascade(function(node) {
            attr = node.attributes;
            if (attr['type'] == 'testSuite' && attr['name'] == name) {
                n = node;
                return false;
            }
        }, this);
        return n;
    },
    // private reset TreeNode attributes before a run
    resetNodes: function() {
        var attr,
        ui;
        this.root.cascade(function(node) {
            if (node != this.root) {
                attr = node.attributes;
                ui = node.ui;
                attr['passed'] = '';
                attr['failed'] = '';
                attr['ignored'] = '';
                attr['errors'] = '';
                attr['state'] = '';
                if (attr['type'] == 'testSuite') {
                    ui.setIconElClass('x-tree-node-icon');
                }
                ui.refresh();
            }
        }, this);
    },
	/**
	 * Creates an Ext.test.TestSuite node.
	 * @param {Ext.test.TestSuite} ts The TestSuite
	 * @return {Ext.tree.TreeNode} The Ext.tree.TreeNode
	 */
    createSuiteNode: function(ts, expanded) {
        return new Ext.tree.TreeNode({
            name: ts.name,
            uiProvider: Ext.test.view.uiProvider,
            type: 'testSuite',
            expanded: expanded,
            state: '',
            passed: '',
            failed: '',
            ignored: '',
            errors: ''
        });
    },
	/**
	 * Creates an Ext.test.TestSuite node and adds it to a parent Ext.tree.TreeNode.
	 * @param {Ext.test.TestSuite} ts The Ext.test.TestSuite
	 * @param {Ext.tree.TreeNode} pnode The parent node
	 */
    addSuiteNode: function(ts, pnode, expanded) {
        pnode = pnode || this.root;
        var oldn = this.getSuiteNode(ts.name);
        if (oldn) {
            oldn.remove(true);
        }
        var n = this.createSuiteNode(ts, expanded);
        pnode.appendChild(n);
    },
	/**
	 * Creates an Ext.test.TestCaseNode.
	 * @param {Ext.test.TestCase} tc The TestCase
	 * @return {Ext.tree.TreeNode} The Ext.tree.TreeNode
	 */
    createCaseNode: function(tc) {
        return new Ext.tree.TreeNode({
            name: tc.name,
            uiProvider: Ext.test.view.uiProvider,
            type: 'testCase',
            state: '',
            passed: '',
            failed: '',
            ignored: '',
            errors: ''
        });
    },
	/**
	 * Creates an Ext.test.TestCase node and adds it to a parent Ext.tree.TreeNode.
	 * @param {Ext.test.TestCase} ts The Ext.test.TestCase
	 * @param {Ext.tree.TreeNode} pnode The parent Ext.tree.TreeNode
	 */
    addCaseNode: function(tc, pnode) {
        pnode = pnode || this.root;
        var n = this.createCaseNode(tc);
        pnode.appendChild(n);
    },
    // private handle test runner events
    onTestRunnerEvent: function(runner, event) {
        var node,
        res;

        switch (event.type) {
          case "fail":
              node = this.getCaseNode(event.testCase.name);
              node.attributes['state'] = this.failText;
              node.ui.setIconElClass('testcase-failed');
              node.attributes['errors'] = event.error.getMessage();
              node.ui.refresh();
              break;
          case "testcasebegin":
              node = this.getCaseNode(event.testCase.name);
              node.attributes['state'] = 'Running...';
              node.ui.refresh();
              break;
          case "testcasecomplete":
              node = this.getCaseNode(event.testCase.name);;
              res = event.results;
              if (res.failed === 0) {
                  node.attributes['state'] = this.passText;
              }
              node.attributes['passed'] = res.passed;
              node.attributes['failed'] = res.failed;
              node.attributes['ignored'] = res.ignored;
              node.ui.refresh();
              break;
          case "testsuitebegin":
              node = this.getSuiteNode(event.testSuite.name);
              node.ui.setIconElClass('testsuite-running');
              node.ui.refresh();
              break;
          case "testsuitecomplete":
              node = this.getSuiteNode(event.testSuite.name);
              res = event.results;
              if (res.passed === res.total) {
                  node.attributes['state'] = this.passText;
                  node.ui.setIconElClass('testsuite-passed');
              }
              if (res.failed > 0) {
                  node.attributes['state'] = this.failText;
                  node.ui.setIconElClass('testsuite-failed');
              }
              node.attributes['passed'] = res.passed;
              node.attributes['failed'] = res.failed;
              node.attributes['ignored'] = res.ignored;
              node.ui.refresh();
              break;
        }
    },
    // private create tree for Ext.test.session
    createTree: function(){
      var ms = this.testSession.getMasterSuite();
      ms.cascade(function(t){
         if (t === ms){ 
            this.addSuiteNode(ms, this.root, true);
         } else if (!t.parentSuite){
             if (t instanceof Ext.test.TestCase){
                this.addCaseNode(t);
             } else {
                this.addSuiteNode(t);
             }
         } else {
             var sn = this.getSuiteNode(t.parentSuite.name);
             if (t instanceof Ext.test.TestCase){
                this.addCaseNode(t,sn);
             } else {
                this.addSuiteNode(t,sn);
             }
         }
      },this);

    }
});
Ext.reg('testtree', Ext.test.view.ColumnTree);
