/**
 * @file: @itorepo/libs/time/timer.ts
 * @desc: contains an implementation of the simple 
 *      {Timer} object based on {TimeEntry}'s stack created,
 *      added, started and stopped during the time measuring
 *      or tracing.
 * @author: Kostyantyn Didenko <kdidenko@ito-global.com>
 * @since: v 1.0.1
 * @license: GPL-3.0
 */



/**
 * @interface declaring Simple Value Validation [SValueV] "chaining" idea
 *     for making maximum validations within the short code expression
 *     and minimum object validator instances
 * @see examples below:
 * @example: const SValueV = SimpleValueValidation;
 * @code: 
 * ```javascript
        let my_param = false;
            my_param = (1 === 1);
        var value = new SValueV(my_param),
            valid = value.isSet().isNotNull().isBoolean();
        console.log(`'${my_param}' value is ${valid}`);   // output: 'true' value it true
   ```
*/
interface ISimpleValueValidation {

    /** 
     * @constructor: starting entire validation chain and taking the target of:
     * @param: {any} existing parameter to validate
     */
    constructor(param: any);

    /**
     * @method: validates if current parameter is already set (have value)
     * @returns: {ISimpleValueValidation} same interface implementation for either 
     *      chaining with next validation condition or getting whole validation chain's
     *      result "primitive" value without any implicid casting methods calls.
     * 
     * @code: 
     * ```javascript
            var value = new SValueV("some string message param"),
                true === value.isSet().isNotNull();
     
      
        // evaluets to `true` because ....isNotNull() is the last method in the chain resulting to
        // return the instance of it's own class which seemlessly executes the valueOf() method
        // whoe's result match the type of literal boolean `true` value at the beginning of expression.
         ```
     */
    isSet(): ISimpleValueValidation;

    /**
     * @method: validates if current parameter doesn't equal `null`
     * @returns: {ISimpleValueValidation} chain instance
     * 
     * @see: `ISimpleValueValidation.isSet()` method declaration for a deeper 
     *      validation chaning overview and code example.
     */
    isNotNull(): ISimpleValueValidation;

    /**
     * @method: validates if current parameter is of primitive `{boolean}` type
     * @returns: {ISimpleValueValidation} chain instance
     * 
     * @see: `ISimpleValueValidation.isSet()` for chaning overview and code example.
     */
    isBoolean(): ISimpleValueValidation;

    /**
     * @override: `Object.prototype.valueOf()`
     * 
     * @method: returns the primitive `{boolean}` value of the validation chain result.
     * @returns: `{(true|false)}` for "passed" or "failed" validation
     */
    valueOf(): boolean;
}



/**
 * @class: BaseParameterValidator implements `Simple Value Validation`
 *      interface in order to provide the quick and simple method
 *      parameters validation chaining.
 */
class BaseParameterValidator {

    /**
     * @private: properties to keep the original value of the parameter
     *      and current validation method result 
     */
    private _currentParam: any = undefined;
    private _currentAnswer: boolean = false;

    /**
     * @property: {any} `current` parameter value
     * @private: shortener alise as _currentParam getter
     */
    private get current(): any {
        return this._currentParam;
    }

    /**
     * @property: {boolean} `answer` for current validation 
     * @private: shortener alise as _currentAnswer setter
     */
    private set answer(result: boolean) {
        this._currentAnswer = result;
    }

    /**
     * @property: {boolean} `break` validation flag
     * @private: tells if any further validations must be canceled
     */
    private get break(): boolean {
        return this.answer === false;
    }

    /**
     * @constructor: for base parameter validator object
     * @param: {any} param to start validation chain
     */
    constructor(param: any) {
        this._currentParam = param;
        this._currentAnswer = true;
    }

    /**
     * @method: validates if current parameter is already set (have value)
     * @returns: `BaseParameterValidator` instance
     * @see: `ISimpleValueValidation.isSet()` method declaration for details 
     */
    public isSet(): BaseParameterValidator {
        if (!this.break) {
            this.answer = (this.current !== undefined);
        }
        return this;
    }

    /**
     * @method: validates if current parameter doesn't equal `null`
     * @returns: `BaseParameterValidator` instance
     * @see: `ISimpleValueValidation.isNotNull()` method declaration for details 
     */
    public isNotNull(): BaseParameterValidator {
        if (!this.break) {
            this.answer = (this.current !== null);
        }
        return this;
    }

    /**
    * @method: validates if current parameter is of primitive `{boolean}` type
    * @returns: `BaseParameterValidator` instance
    * @see: `ISimpleValueValidation.isBoolean()` method declaration for details 
    */
    public isBoolean(): BaseParameterValidator {
        if (!this.break) {
            this.answer = (this.current === true || this.current === false);
        }
        return this;
    }

    /**
    * @method: validates if current parameter is of {boolean} `true` value
    * @returns: `BaseParameterValidator` instance
    * @see: `ISimpleValueValidation.isTrue()` method declaration for details 
    */
    public isTrue(): BaseParameterValidator {
        if (!this.break) {
            this.answer = (this.current === true);
        }
        return this;
    }

    /**
     * @method: validates if current parameter is of {boolean} `false` value
     * @returns: `BaseParameterValidator` instance
     * @see: `ISimpleValueValidation.isTrue()` method declaration for details 
     */
    public isFalse(): BaseParameterValidator {
        if (!this.break) {
            this.answer = (this.current === false);
        }
        return this;
    }

    /**
       * @override: `Object.prototype.valueOf()`
       * @implements: `ISimpleValueValidation.valueOf()`
       * 
       * @method: returns the primitive `{boolean}` value of the validation chain result.
       * @returns: `{(true|false)}` for "passed" or "failed" validation
       */
    public valueOf(): boolean {
        return this.answer;
    }
}

/**
 * alise for BaseParameterValidator
 */
const BParamVal = BaseParameterValidator;


/**
 * @interface: for the Time Entry element which defines it's basic timing methods for creating,
 *         start()'ing, stop()'ing and reset()'ing timer metrics to calculate the elapsed() number
 *         of milliseconds for the activity being tracked
 */
interface ITimeEntry {
    /**
     * @constructor: method for instantiating {ITimeEntry} objects. It takes:
     * @param:  {(string|null)} - marker to differ Time Entries within arrays and collections
     * @param: {(boolean|null)} - start flag to tell constructor start timer within the constructor
     */
    constructor(marker: string, start: boolean);
    /**
     * @method: start()'s counting time since the moment it was executed
     * @param: {(string|null)} - the final place to define the Entry's recognizability marker
     * 
     * @returns: {number} - EPOCH milliseconds for the moment the Entry timer was started
     */
    start(marker: string): number;
    /**
     * @method: stops()'s counting the time since this moment
     * @returns: {number} - EPOCH milliseconds for the moment the Entry timer was stopped
     */
    stop(): number;
    /**
     * @method: reset()'s all counter elements to their initial state
     * @returns: {void}
     */
    reset(): void;
    /**
     * @method: elapsed() method calculating the exact time in milliseconds between
     *           the moment it was executed and the moment the Entry timer was started
     * @returns: {number} - number of milliseconds between NOW and ITimeEntry.start() time
     */
    elapsed(): number;
};

class TimeEntry implements ITimeEntry {

    private _started: number = 0;
    private _stopped: number = 0;
    private _marker: (string | null) = null;

    get ready(): boolean {
        return (this._started == 0) && (this._stopped == this._started);
    }

    get running(): boolean {
        return (this._started > 0) && (this._stopped == 0);
    }

    get stopped(): boolean {
        return (this._started > 0) && (this._stopped >= this._started);
    }

    /**
     * @method: start()'s counting time since the moment it was executed
     * @param: {(string|null)} - the final place to define the Entry's recognizability marker
     */
    constructor(marker: string, start: boolean) {
        let strt = new BParamVal(start);

        this._marker = marker || null;
        this._started = strt.isBoolean().isTrue() ? Date.now() : this._started;
    }

    public start(marker: string): number {
        this._marker = marker || this._marker;
        this._started = Date.now();
        return this._started;
    }

    public stop(): number {
        this._stopped = (this.running) ? Date.now() : this._stopped;
        return this._stopped;
    }

    public reset(): void {
        this._started = 0;
        this._stopped = 0;
        this._marker = null;
    }

    public elapsed(): number {
        //TODO: @kdidenko: finish here!!!
        throw new Error("Method not implemented.");
    }

}