/**
 * @class Ext.test.view.ColumnTree
 * A ColumnTree that show test registered in Ext.test.session. 
 * Based on Ext.ux.tree.ColumnTree sample.
 * @extends Ext.tree.TreePanel
 * @author  Nicolas FERRERO (aka yhwh) for Sylogix
 * @version 1.1
 * @date	May 21, 2010
 */
Ext.test.view.ColumnTree = Ext.extend(Ext.tree.TreePanel, {
    useArrows: true,
    header: true,
    passText: 'Passed',
    failText: 'Failed!',
    autoScroll: true,
    rootVisible: false,
    lines : false,
    borderWidth : Ext.isBorderBox ? 0 : 2, // the combined left/right border for each cell
    cls : 'x-column-tree',
    initComponent: function() {
        this.createRootNode();
        this.configureColumns();
        this.monitorTestSession();
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
    // monitor test session
    monitorTestSession: function(){
        this.mon(Ext.test.session, 'registersuite', function(s, ts) {
            this.addSuiteNode(ts);
        }, this);
        this.mon(Ext.test.session, 'registercase', function(s, tc) {
            this.addCaseNode(tc);
        }, this);
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
        this.colheaders.setWidth('auto');;
    },
  /**
   * Get an Ext.test.TestCase Node by it's name.
   * @param {String} name The name of the Ext.test.TestCase
   * @return {Ext.tree.TreeNode} The node or undefined
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
   * Get a TestSuite Node by it's name.
   * @param {String} name The name of the TestSuite
   * @return {Ext.tree.TreeNode} The Ext.tree.TreeNode or undefined
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
   * Create an Ext.test.TestSuite Node.
   * @param {Ext.test.TestSuite} ts The TestSuite
   * @return {Ext.tree.TreeNode} The Ext.tree.TreeNode
   */
    createSuiteNode: function(ts) {
        return new Ext.tree.TreeNode({
            name: ts.name,
            uiProvider: Ext.test.view.uiProvider,
            type: 'testSuite',
            state: '',
            passed: '',
            failed: '',
            ignored: '',
            errors: ''
        });
    },
  /**
   * Create an Ext.test.TestSuite Node and add to a Parent Ext.tree.TreeNode.
   * @param {Ext.test.TestSuite} ts The Ext.test.TestSuite
   * @param {Ext.tree.TreeNode} pnode The parent Node
   */
    addSuiteNode: function(ts, pnode) {
        pnode = pnode || this.root;
        var oldn = this.getSuiteNode(ts.name);
        if (oldn) {
            oldn.remove(true);
        }
        var n = this.createSuiteNode(ts);
        pnode.appendChild(n);
        var items = ts.items;
        var len = items.length;
        var it;
        for (var i = 0; i < len; i++) {
            it = items[i];
            if (it instanceof Y.Test.Case) {
                this.addCaseNode(it, n);
            }
            if (it instanceof Y.Test.Suite) {
                this.addSuiteNode(it, n);
            }
        }
    },
  /**
   * Create a Ext.test.TestCaseNode.
   * @param {Ext.test.TestCase} tc the TestCase
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
   * Create an Ext.test.TestCase Node and add to a parent Ext.tree.TreeNode.
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
    }
});

Ext.reg('testtree', Ext.test.view.ColumnTree);
