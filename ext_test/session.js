/**
 * @class Ext.test.Session
 * The Test Session Class. 
 * @extends Ext.util.Observable
 * @author  Nicolas FERRERO (aka yhwh) for Sylogix
 * @version 1.1.1
 * @date	May 28, 2010
 */
Ext.test.Session = Ext.extend(Ext.util.Observable, {
   /**
     * @property ts
     * A MixedCollection of instancied Ext.test.TestSuite's.
     * @type Ext.util.MixedCollection
     */
    ts: new Ext.util.MixedCollection(),
   /**
     * @property tc
     * A MixedCollection of instancied Ext.test.TestCase's.
     * @type Ext.util.MixedCollection
     */
    tc: new Ext.util.MixedCollection(),
    // Add some events
    constructor: function() {
        Ext.test.Session.superclass.constructor.apply(this, arguments);
        this.addEvents(
        	/**
			     * @event registersuite
			     * Fires after a Ext.test.TestSuite is registered in this Ext.test.Session.
			     * @param {Ext.test.Session} session This Ext.test.Session instanciated object.
			     * @param {Ext.test.TestSuite} tsuite The Ext.test.TestSuite.
			     */
        'registersuite',
      	/**
		     * @event addtestobject
		     * Fires when an Ext.test.TestCase or an Ext.test.TestSuite is added to 
		     * this Ext.test.TestSuite.
		     * @param {Ext.test.Session} session This Ext.test.Session instanciated object.
		     * @param {Ext.test.TestSuite} testsuite This Ext.test.TestSuite object.
		     * @param {Ext.test.TestSuite} testcase The added Ext.test.TestCase.
		     */  
        'addtestobject',
        	/**
			     * @event registercase
			     * Fires after a Ext.test.TestCase is registered in this Ext.test.Session.
			     * @param {Ext.test.Session} session This Ext.test.Session instanciated object.
			     * @param {Ext.test.TestCase} tsuite The Ext.test.TestCase.
			     */
        'registercase');
    },
	/**
	 * Gets an existing Ext.test.TestSuite by name, or create it if it doesn't exist yet.
	 * @param {String} name The name of the Ext.test.TestSuite
	 * @return {Ext.test.TestSuite} The Ext.test.TestSuite
	 */
    getSuite: function(name) {
        var t = this.findSuite(name);
        if (!t) {
            t = this.createSuite(name);
        }
        return t;
    },
	/**
	 * Creates an Ext.test.TestSuite.
	 * @param {String} name The name of the Ext.test.TestSuite
	 * @return {Ext.test.TestSuite} The Ext.test.TestSuite
	 */
    createSuite: function(name) {
        return new Ext.test.TestSuite({
            name: name
        });
    },
	/**
	 * Finds an Ext.test.TestSuite by name.
	 * @param {String} name The name of the Ext.test.TestSuite
	 * @return {Ext.test.TestSuite} The Ext.test.TestSuite, or null if the TestSuite is not registered.
	 */
    findSuite: function(name) {
        return this.ts.get(name);
    },
	/**
	 * Registers an Ext.test.TestSuite into this session.
	 * @param {Ext.test.TestSuite} testSuite The TestSuite to register.
	 */
    registerSuite: function(testSuite) {
        var name = testSuite.name;
        if (this.ts.indexOf(name) == -1) {
            this.ts.add(name, testSuite);
        }
        this.fireEvent('registersuite', this, testSuite);
    },
    addTestObject: function (testSuite, testObject){
        if (testObject instanceof Y.Test.Suite){
          if (this.ts.indexOf(testObject.name) != -1) {
              this.ts.remove(testObject);
          }
        }
        this.fireEvent('addtestobject', this, testSuite, testObject);
    },
	/**
	 * Registers an Ext.test.TestCase into this session.
	 * @param {Ext.test.TestCase} testCase The TestCase to register.
	 */
    registerCase: function(testCase) {
        var name = testCase.name;
        if (this.tc.indexOf(name) == -1) {
            this.tc.add(name, testCase);
        }
        this.fireEvent('registercase', this, testCase);
    },
	/**
	 * Finds an Ext.test.TestCase by name.
	 * @param {String} name The name of the Ext.test.TestCase 
	 * @return {Ext.test.TestCase} The Ext.test.TestCase, or null if the TestCase is not registered.
	 */
    findCase: function(name) {
        return this.ts.get(name);
    },
	/**
	 * Adds a Ext.test.TestCase to this Ext.test.Session, adding it to a TestSuite. Accepts 
	 * an anonymous object as the TestCase, which will be converted into a TestCase instance.
	 * @param {String} name The name of the parent Ext.test.TestSuite. The parent TestSuite will be created if it does not exist yet.
	 * @param {Ext.test.TestCase|Object} testCase The TestCase, or anonymous object that defines the TestCase.
	 */
    addTest: function(name, testCase) {
        var testSuite = this.getSuite(name);
        testSuite.add(testCase);
    },
	/**
	 * Gets the number of registered Ext.test.TestCase's in this Ext.test.Session.
	 * @return {Number} The number of TestCases.
	 */
    getTestCaseCount: function() {
        var c = 0;
        this.ts.each(function(t){
            c += t.getTestCaseCount();
        },this);
        c += this.tc.getCount();
        return c;
    },
	/**
	 * Gets the number of registered Ext.test.TestSuite's in this Ext.test.Session.
	 * @return {Number} The number of TestSuites.
	 */
    getTestSuiteCount: function() {
        var c = 0;
        this.ts.each(function(t){
            c += (t.getTestSuiteCount() + 1);
        },this);
        return c;
    },
	/**
	 * Destroys the Ext.test.Session.
	 */
    destroy: function(){
       this.ts.clear();
       this.tc.clear();
       this.purgeListeners()
    }
});

Ext.test.session = new Ext.test.Session();
