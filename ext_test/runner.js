/**
 * @class Ext.test.Runner
 * An Observable that manage the YUI Test Runner
 * @extends Ext.util.Observable
 * @author  Nicolas FERRERO (aka yhwh) for Sylogix
 * @version 1.1.1
 * @date	May 28, 2010
 */
Ext.test.Runner = Ext.extend(Ext.util.Observable, {
    constructor: function() {
        Ext.test.Runner.superclass.constructor.apply(this, arguments);
		    this.addEvents(
			    /**
			     * @event beforebegin
			     * Fires before the test runner begins.
			     * @param {Ext.test.Runner} runner This Ext.test.Runner object.
			     * @param {EventObject} event The runner event.
			     */
			    'beforebegin',
			    /**
			     * @event begin
			     * Fires when the test runner begins.
			     * @param {Ext.test.Runner} runner This Ext.test.Runner object.
			     * @param {EventObject} event The runner event.
			     */
			    'begin',
			    /**
			     * @event complete
			     * Fires when the test runner has finished.
			     * @param {Ext.test.Runner} runner This Ext.test.Runner object.
			     * @param {EventObject} event The runner event.
			     */
			    'complete',
			    /**
			     * @event pass
			     * Fires when a TestCase passes.
			     * @param {Ext.test.Runner} runner This Ext.test.Runner object.
			     * @param {EventObject} event The runner event.
			     */
			    'pass',
			    /**
			     * @event fail
			     * Fires when a TestCase fails.
			     * @param {Ext.test.Runner} runner This Ext.test.Runner object.
			     * @param {EventObject} event The runner event.
			     */
			    'fail',
			    /**
			     * @event ignore
			     * Fires when a TestCase is ignored.
			     * @param {Ext.test.Runner} runner This Ext.test.Runner object.
			     * @param {EventObject} event The runner event.
			     */
			    'ignore',
			    /**
			     * @event testcasebegin
			     * Fires when a TestCase begins.
			     * @param {Ext.test.Runner} runner This Ext.test.Runner object.
			     * @param {EventObject} event The runner event.
			     */
			    'testcasebegin',
			    /**
			     * @event testcasecomplete
			     * Fires when a TestCase has finished.
			     * @param {Ext.test.Runner} runner This Ext.test.Runner object.
			     * @param {EventObject} event The runner event.
			     */
			    'testcasecomplete',
			    /**
			     * @event testsuitebegin
			     * Fires when a TestSuite begins.
			     * @param {Ext.test.Runner} runner This Ext.test.Runner object.
			     * @param {EventObject} event The runner event.
			     */
			    'testsuitebegin',
			    /**
			     * @event testsuitecomplete
			     * Fires when a TestSuite has finished.
			     * @param {Ext.test.Runner} runner This Ext.test.Runner object.
			     * @param {EventObject} event The runner event.
			     */
			    'testsuitecomplete'
		    );
        this.monitorYUITestRunner();
        this.monitorTestSession();
    },
    // YUI TestRunner events
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
        // Master Suite event drop
        if (type == 'testsuitebegin' && e.testSuite.name == this.runner.getName()){
            return;
        }
        this.fireEvent(type, this, e);
    },
    // Monitor a Ext.test.session
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
     * Runs registered testCases and testSuites.
     */
    run: function() {
        this.fireEvent('beforebegin', this);
        //this.clear();
        this.regs.each(function(r) {
            this.add(r);
        }, this.runner);
        this.runner.run(true);
    },
    /**
     * Removes all test objects. 
     */
    clear: function(){
      this.runner.clear();
    },
    /**
     * Unsubscribe runner events and purge all listeners in Ext.test.runner. 
     */
    destroy: function() {
      this.runner.unsubscribeAll();
      this.purgeListeners();
    }
});
Ext.test.runner = new Ext.test.Runner();
