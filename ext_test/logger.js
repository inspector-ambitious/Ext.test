/**
 * @class Ext.test.Logger
 * A Console that show Ext.test.runner events
 * @extend Ext.grid.GridPanel
 * @author  Nicolas FERRERO (aka yhwh) for Sylogix
 * @version 1.0
 * @date	May 19, 2010
 */
Ext.test.Logger = Ext.extend(Ext.grid.GridPanel, {
    autoWidth: true,
    viewConfig: {
        forceFit: true
    },
    cls: 'x-test-logger',
    disableSelection: true,
    trackMouseOver: false,
    initComponent: function() {
        this.store = new Ext.data.JsonStore({
            fields: ['logs', 'state']
            });
        this.columns = [{
            header: 'Logs',
            dataIndex: 'logs',
            renderer: function(value, cell, record) {
                return '<span class="x-test-logger-state-' + record.get('state') + '">' + value + '</span>';
            }
        }];
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

        Ext.test.Logger.superclass.initComponent.apply(this, arguments);
    },
    onTestRunnerEvent: function(r, e) {
        var logs;
        switch (e.type) {
        case 'begin':
            logs = "Begin at " + new Date();
            break;
        case 'complete':
            logs = "Completed at " + new Date();
            break;
        case 'testcasebegin':
            logs = 'TestCase ' + e.testCase.name + ' : Begin.';
            break;
        case 'testcasecomplete':
            logs = 'TestCase ' + e.testCase.name + ' : Complete.';
            break;
        case 'testsuitebegin':
            logs = 'TestSuite ' + e.testSuite.name + ' : Begin.';
            break;
        case 'testsuitecomplete':
            logs = 'TestSuite ' + e.testSuite.name + ' : Complete.';
            break;
        case 'pass':
            logs = e.testName + ' : Passed.';
            break;
        case 'fail':
            logs = e.testName + ' : Failed! <br />' + e.error.toString();
            break;
        case 'ignore':
            logs = e.testName + ' : Ignored.';
            break;
        }
        if (logs) {
            this.store.add(new Ext.data.Record({
                logs: logs,
                state: e.type
            }));
        }
    }

});
Ext.reg('testlogger', Ext.test.Logger);
