/**
 * @class Ext.test.Runner
 * An observable that manage the Yui Test Runner
 * @extend Ext.util.Observanle
 * @author  Nicolas FERRERO (aka yhwh) for Sylogix
 * @version 1.0
 * @date	May 19, 2010
 */
Ext.test.Runner = Ext.extend(Ext.util.Observable, {
    constructor: function() {
        Ext.test.Runner.superclass.constructor.apply(this, arguments);
        this.addEvents('begin', 'complete', 'pass', 'fail', 'ignore', 'testcasebegin', 'testcasecomplete', 'testsuitebegin', 'testsuitecomplete');
        this.runner = Y.Test.Runner;
        this.runner.subscribe("begin", this.onTestRunnerEvent, this, true);
        this.runner.subscribe("complete", this.onTestRunnerEvent, this, true);
        this.runner.subscribe("fail", this.onTestRunnerEvent, this, true);
        this.runner.subscribe("ignore", this.onTestRunnerEvent, this, true);
        this.runner.subscribe("pass", this.onTestRunnerEvent, this, true);
        this.runner.subscribe("testcasebegin", this.onTestRunnerEvent, this, true);
        this.runner.subscribe("testcasecomplete", this.onTestRunnerEvent, this, true);
        this.runner.subscribe("testsuitebegin", this.onTestRunnerEvent, this, true);
        this.runner.subscribe("testsuitecomplete", this.onTestRunnerEvent, this, true);
        this.regs = new Ext.util.MixedCollection();
        Ext.test.session.on('registersuite', this.addReg, this);
        Ext.test.session.on('registercase', this.addReg, this);
    },
    onTestRunnerEvent: function(e) {
        this.fireEvent(e.type, this, e);
    },
    run: function() {
        this.runner.clear();
        this.regs.each(function(r) {
            this.runner.add(r);
        }, this);
        this.runner.run();
    },
    addReg: function(s, t) {
        this.regs.add(t.name, t);
    }
});
Ext.test.runner = new Ext.test.Runner();
