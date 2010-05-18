Ext.ns('Ext.ux');
/**
 * @class Ext.ux.bootMask
 * Georges Booting Body Mask
 * @extends Ext.LoadMask
 */
Ext.ux.bootMask = Ext.extend(Ext.LoadMask,{
    /**
     * @cfg {String} zIndex (defaults to 11000) the mask zIndex value
     */
     zIndex: 11000
    // add zIndex support to mask
   , onBeforeLoad : function(){
        if(!this.disabled){
            var mask = this.el.mask(this.msg, this.msgCls);
            mask.setStyle('z-index',this.zIndex);
        }
    }
});
