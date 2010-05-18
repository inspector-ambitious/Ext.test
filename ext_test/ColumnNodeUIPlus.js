Ext.ux.tree.ColumnTreePlus = Ext.extend(Ext.tree.ColumnTree, {
    onRender : function(){
        Ext.tree.ColumnTree.superclass.onRender.apply(this, arguments);
        this.colheaders = this.bwrap.createChild({cls:'x-tree-headers'}, this.bwrap.dom.lastChild);

        var cols = this.columns, c;

        for(var i = 0, len = cols.length; i < len; i++){
             c = cols[i];
             this.colheaders.createChild({
                 cls:'x-tree-hd ' + (c.cls?c.cls+'-hd':''),
                 cn: {
                     cls:'x-tree-hd-text',
                     html: c.header
                 },
                 style: 'width:'+(c.width-this.borderWidth)+'px;'
             });
        }
        this.colheaders.createChild({cls:'x-clear'});
        // prevent floats from wrapping when clipped
        this.colheaders.setWidth('auto');;
    }
});

Ext.reg('columntreeplus', Ext.ux.tree.ColumnTreePlus);
Ext.tree.ColumnTreePlus = Ext.ux.tree.ColumnTreePlus;

Ext.ux.tree.ColumnNodeUIPlus = Ext.extend(Ext.ux.tree.ColumnNodeUI,{
  refreshNode : function() {
    var n = this.node;
    if (!n.rendered){
      return; 
    }
    var t = n.getOwnerTree();
    var a = n.attributes;
    var cols = t.columns;

    var el = n.ui.getEl().firstChild;
    
    var cells = el.childNodes;
    
    for(var i = 1, len = cols.length; i < len; i++)
    {
        var d = cols[i].dataIndex;
        var v = (a[d]!=null)? a[d] : '';
        if (cols[i].renderer) v = cols[i].renderer(v);
        cells[i].firstChild.innerHTML = v;        
    }
 }
 , setIconElClass : function(className){
     var n = this.node;
     if (!n.rendered){
      return; 
     }
     var iconEl = this.getIconEl();
     iconEl.className = className;
 }
});

Ext.tree.ColumnNodeUIPlus = Ext.ux.tree.ColumnNodeUIPlus;
