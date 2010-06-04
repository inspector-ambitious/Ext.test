/**
 * @class Ext.test.view.StartButton
 * A Button that run Ext.test.runner.
 * @extends Ext.Button
 * @author  Nicolas FERRERO (aka yhwh) for Sylogix
 * @version 1.3
 * @date	June 4, 2010
 */
Ext.test.view.StartButton = Ext.extend(Ext.Button,{
    text: 'Start',
    iconCls: 'x-tbar-page-next',
    initComponent: function() {
        this.setHandler(this.runTests, this);
        this.monitorTestRunner();
        Ext.test.view.StartButton.superclass.initComponent.apply(this,arguments);
    },
    runTests: function() {
        this.disable();
        Ext.test.runner.run();
    },
    monitorTestRunner: function() {
        this.mon(Ext.test.runner, 'complete', this.enable, this);
    }
});
Ext.reg('teststartbutton', Ext.test.view.StartButton);
