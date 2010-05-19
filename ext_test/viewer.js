/**
 * @class Ext.test.uiProvider
 * A ColumnNodeUI that with refresh support and icon change
 * @extend Ext.ux.tree.ColumnNodeUI
 * @author  Nicolas FERRERO (aka yhwh) for Sylogix
 * @version 1.0
 * @date	May 19, 2010
 */
Ext.test.uiProvider = Ext.extend(Ext.ux.tree.ColumnNodeUI, {
    /**
   * Refresh Node
   */
    refresh: function() {
        var n = this.node;
        if (!n.rendered) {
            return;
        }
        var t = n.getOwnerTree();
        var a = n.attributes;
        var cols = t.columns;
        var el = n.ui.getEl().firstChild;
        var cells = el.childNodes;
        for (var i = 1, len = cols.length; i < len; i++) {
            var d = cols[i].dataIndex;
            var v = (a[d] != null) ? a[d] : '';
            if (cols[i].renderer) {
                v = cols[i].renderer(v, n);
            }
            cells[i].firstChild.innerHTML = v;
        }
    },
    /**
   * Set Node icon class 
   * @param {String} className The name of the class
   */
    setIconElClass: function(className) {
        var n = this.node;
        if (!n.rendered) {
            return;
        }
        var iconEl = this.getIconEl();
        iconEl.className = className;
    }
});
/**
 * @class Ext.test.Viewer
 * A ColumnTree that show test registered in Ext.test.session 
 * @extend Ext.tree.ColumnTree
 * @author  Nicolas FERRERO (aka yhwh) for Sylogix
 * @version 1.0
 * @date	May 19, 2010
 */
Ext.test.Viewer = Ext.extend(Ext.tree.ColumnTree, {
    useArrows: true,
    header: true,
    passText: 'Passed',
    failText: 'Failed!',
    autoScroll: true,
    testCaseCount: 0,
    rootVisible: false,
    initComponent: function() {
        this.tbar = [new Ext.Button({
            text: 'Start',
            iconCls: 'x-tbar-page-next',
            ref: '../startButton',
            handler: this.onStart,
            scope: this
        }), '->', new Ext.ProgressBar({
            ref: '../pbar',
            text: 'Ready',
            width: 500
        })];
        this.root = new Ext.tree.TreeNode({
            text: 'My Tests Session',
            expanded: true
        });
        this.columns = [{
            dataIndex: 'name',
            header: 'Name',
            id: 'name',
            width: 300
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
            dataIndex: 'results',
            header: 'Results',
            id: 'results',
            width: 200
        }, {
            dataIndex: 'details',
            id: 'details',
            header: 'Details',
            width: 250,
            renderer: function(val) {
                return '<span ext:qtip="' + val + '">' + val + '</span>';
            }
        }];

        // monitor test session
        this.mon(Ext.test.session, 'registersuite', function(s, ts) {
            this.addSuiteNode(ts);
        }, this);
        this.mon(Ext.test.session, 'registercase', function(s, tc) {
            this.addCaseNode(tc);
        }, this);

        // monitor test runner
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

        Ext.test.Viewer.superclass.initComponent.apply(this, arguments);
    },
    // See columnTree example for this
    onRender: function() {
        Ext.tree.ColumnTree.superclass.onRender.apply(this, arguments);
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
   * Get a TestCase Node by it's name.
   * @param {String} name The name of the TestCase
   * @return {Ext.tree.TreeNode} return the node
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
   * @return {Ext.tree.TreeNode} the node
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
    /**
   * Get the number of registered testCase in this Ext.test.session.
   * @return {Number} the number of testCase
   */
    getTestCaseCount: function() {
        var attr,
        count = 0;
        this.root.cascade(function(node) {
            attr = node.attributes;
            if (attr['type'] == 'testCase') {
                count++;
            }
        }, this);
        return count;
    },
    // private handle Start Button Click
    onStart: function() {
        this.startButton.disable();
        this.testCaseCount = 0;
        this.resetNodes();
        Ext.test.runner.run();
    },
    // private reset TreeNode attributes before a run
    resetNodes: function() {
        var attr,
        ui;
        this.root.cascade(function(node) {
            if (node != this.root) {
                attr = node.attributes;
                ui = node.ui;
                attr['results'] = '';
                attr['details'] = '';
                attr['state'] = '';
                if (attr['type'] == 'testSuite') {
                    ui.setIconElClass('x-tree-node-icon');
                }
                ui.refresh();
            }
        }, this);
    },
    /**
   * Create a TestSuite Node.
   * @param {Ext.test.TestSuite} ts the TestSuite
   * @return {Ext.tree.TreeNode} return the node
   */
    createSuiteNode: function(ts) {
        return new Ext.tree.TreeNode({
            name: ts.name,
            uiProvider: Ext.test.uiProvider,
            type: 'testSuite',
            state: '',
            results: '',
            details: ''
        });
    },
    /**
   * Add a TestSuite  to a Parent Node
   * @param {Ext.test.TestSuite} ts the TestSuite
   * @param {Ext.tree.TreeNode} pnode the parent Node
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
   * Create a TestCase Node.
   * @param {Ext.test.TestCase} tc the TestCase
   * @return {Ext.tree.TreeNode} return the node
   */
    createCaseNode: function(tc) {
        return new Ext.tree.TreeNode({
            name: tc.name,
            uiProvider: Ext.test.uiProvider,
            type: 'testCase',
            state: '',
            results: '',
            details: ''
        });
    },
    /**
   * Add a TestCase to a Parent Node
   * @param {Ext.test.TestCase} ts the TestSuite
   * @param {Ext.tree.TreeNode} pnode the parent Node
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
            var rd = node.attributes['details'];
            var details = String.format('{0}{1}: {2}<br>', rd || '', event.testName, event.error.toString());
            node.attributes['details'] = details;
            node.ui.refresh();
            break;
        case "testcasebegin":
            node = this.getCaseNode(event.testCase.name);
            node.attributes['state'] = 'Running...';
            node.ui.refresh();
            break;
        case "testcasecomplete":
            this.testCaseCount++;
            node = this.getCaseNode(event.testCase.name);
            var count = this.getTestCaseCount();
            var c = this.testCaseCount / count;
            this.pbar.updateProgress(c, Math.round(100 * c) + '% completed...');
            res = event.results;
            if (res.failed === 0) {
                node.attributes['state'] = this.passText;
            }
            node.attributes['results'] = String.format('Passed: {0}, Failed: {1}, Ignored: {2} ', res.passed, res.failed, res.ignored);
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
            node.attributes['results'] = String.format('Passed: {0}, Failed: {1}, Ignored: {2} ', res.passed, res.failed, res.ignored);
            node.ui.refresh();
            break;
        case "complete":
            this.pbar.updateProgress(1, '100% completed...');
            this.startButton.enable();
            break;
        }
    }
});

Ext.reg('testviewer', Ext.test.Viewer);
