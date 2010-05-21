/**
 * @class Ext.test.Runner
 * An Observable that manage the YUI Test Runner
 * @extends Ext.util.Observable
 * @author  Nicolas FERRERO (aka yhwh) for Sylogix
 * @version 1.1
 * @date	May 21, 2010
 */
Ext.test.Runner = Ext.extend(Ext.util.Observable, {
    constructor: function() {
        Ext.test.Runner.superclass.constructor.apply(this, arguments);
         /**
           * @event beforebegin
           * Fires before test runner begin.
           * @param {Ext.test.Runner} runner This Ext.test.Runner object.
           * @param {EventObject} event The runner event.
           */
          /**
           * @event begin
           * Fires when test runner begin.
           * @param {Ext.test.Runner} runner This Ext.test.Runner object.
           * @param {EventObject} event The runner event.
           */
          /**
           * @event complete
           * Fires when test runner has finished.
           * @param {Ext.test.Runner} runner This Ext.test.Runner object.
           * @param {EventObject} event The runner event.
           */
          /**
           * @event pass
           * Fires when testCase pass.
           * @param {Ext.test.Runner} runner This Ext.test.Runner object.
           * @param {EventObject} event The runner event.
           */
          /**
           * @event fail
           * Fires when testCase fail.
           * @param {Ext.test.Runner} runner This Ext.test.Runner object.
           * @param {EventObject} event The runner event.
           */
          /**
           * @event ignore
           * Fires when testCase is ignored.
           * @param {Ext.test.Runner} runner This Ext.test.Runner object.
           * @param {EventObject} event The runner event.
           */
          /**
           * @event testcasebegin
           * Fires when a testCase begin.
           * @param {Ext.test.Runner} runner This Ext.test.Runner object.
           * @param {EventObject} event The runner event.
           */
          /**
           * @event testcasecomplete
           * Fires when a testCase has finished.
           * @param {Ext.test.Runner} runner This Ext.test.Runner object.
           * @param {EventObject} event The runner event.
           */
          /**
           * @event testsuitebegin
           * Fires when a testSuite begin.
           * @param {Ext.test.Runner} runner This Ext.test.Runner object.
           * @param {EventObject} event The runner event.
           */
          /**
           * @event testsuitecomplete
           * Fires when a testSuite has finished.
           * @param {Ext.test.Runner} runner This Ext.test.Runner object.
           * @param {EventObject} event The runner event.
           */
        this.addEvents('beforebegin', 'begin', 'complete', 'pass', 'fail', 'ignore', 'testcasebegin', 'testcasecomplete', 'testsuitebegin', 'testsuitecomplete');
        this.monitorYUITestRunner();
        this.monitorTestSession();
    },
    // YUI TestRunner event hooks
    monitorYUITestRunner: function() {
        var r = Y.Test.Runner;
        var fn = this.onTestRunnerEvent;
        r.subscribe("begin", fn, this, true);
        r.subscribe("complete", fn, this, true);
        r.subscribe("fail", fn, this, true);
        r.subscribe("ignore", fn, this, true);
        r.subscribe("pass", fn, this, true);
        r.subscribe("testcasebegin", fn, this, true);
        r.subscribe("testcasecomplete", fn, this, true);
        r.subscribe("testsuitebegin", fn, this, true);
        r.subscribe("testsuitecomplete", fn, this, true);
        this.runner = r;
    },
    // handle YUI TestRunner events
    onTestRunnerEvent: function(e) {
        var type = e.type;
        // yui 3 test Master Suite event drop
        if (type == 'testsuitebegin' && e.testSuite.name == this.runner.getName()){
            return;
        }
        this.fireEvent(type, this, e);
    },
    // Monitor Ext.test.session
    monitorTestSession: function(){
        this.regs = new Ext.util.MixedCollection();
        Ext.test.session.on('registersuite', this.register, this);
        Ext.test.session.on('registercase', this.register, this);
    },
    // handle Ext.test.session test registering
    register: function(s, t) {
        this.regs.add(t.name, t);
    },
    /**
     * Run registered testCase and testSuites.
     */
    run: function() {
        this.fireEvent('beforebegin', this);
        this.runner.clear();
        this.regs.each(function(r) {
            this.runner.add(r);
        }, this);
        this.runner.run();
    }
});
Ext.test.runner = new Ext.test.Runner();
