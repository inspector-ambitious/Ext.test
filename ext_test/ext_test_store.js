// Begin of Store configuration 

Ext.test.Store = new Ext.data.GroupingStore({
    reader : new Ext.data.JsonReader({
      fields : [ 
         'testName'
       , 'testSuite'
       , 'testResult'
       , 'testStatus' 
       , 'testDetails'
      ]
  })
  , groupField : 'testSuite'
});

Ext.test.Record = Ext.data.Record.create([
    { name : 'testName'    }
  , { name : 'testSuite'   }
  , { name : 'testResult'  }
  , { name : 'testStatus'  }
  , { name : 'testDetails' }
]);

// End of Store configuration
