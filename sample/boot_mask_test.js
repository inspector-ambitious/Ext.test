new Ext.test.testCase({
   name : 'Test defaultValues, zIndex and disable'
 , testSuiteName : 'Ext.ux.bootMask'
 , setUp : function() {
     this.el = Ext.getBody().createChild({tag: 'div'});
     this.bootMask = new Ext.ux.bootMask(this.el,{
	   msg: 'Test'
     });
 }    
 , tearDown : function() {
	 this.bootMask.destroy();
     Ext.destroy(this.el);
 }
  , testDefaultValues: function() {
     Y.Assert.areEqual('11000', this.bootMask.zIndex, 'Test zIndex default value');
 }
 , testZindex : function(){
     this.bootMask.show();
     var mask = this.el.child('.ext-el-mask');
     var zindex = mask.getStyle('z-index');
     Y.Assert.areSame(zindex, this.bootMask.zIndex, 'Test to ensure that global mask z-index is valid.');
  }
  , testDisable : function(){
	 this.bootMask.disable();
	 this.bootMask.show();
	 var mask = this.el.child('.ext-el-mask');
	 Y.Assert.isNull(mask, 'Test that mask is not created when Ext.ux.bootMask is disabled');
  }
}).register();
