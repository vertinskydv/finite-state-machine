class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if (!config) {
            throw new (Error);
        }
        this.config = JSON.parse(JSON.stringify(config));
        this.currentState = config.initial;
        this.triggerError = false;
        this.previousState = null;
        this.nextState = null;
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.currentState;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        this.previousState = this.currentState;
        if (Object.keys(this.config.states).includes(state)) {
            this.currentState = state;
        } else {
            throw new Error();
        }
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        if ((event) && (!this.triggerError)) {
            for (let state in this.config.states) {
                for (let transState in  this.config.states[state].transitions) {
                    if (transState == event) {
                        this.changeState(this.config.states[state].transitions[transState]);
                        return;
                    }
                }
            }
        }
        this.triggerError = true;
        // throw new Error();
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.currentState = this.config.initial;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        if (!event) {
            return Object.keys(this.config.states);
        } else {
            let stateArr = [];
            for (let state in this.config.states) {
                for (let transState in  this.config.states[state].transitions) {
                    if (transState == event) {
                        stateArr.push(state);
                    }
                }
            }
            return stateArr;
        }
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if (this.previousState) {
            this.nextState = this.currentState;
            this.changeState(this.previousState);
            this.previousState = false;
            return true;
        }
        return false;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if (this.nextState) {
            this.changeState(this.nextState);
            this.nextState = false;
            return true;
        }
        if ((this.previousState === null) || (!this.nextState)) {
            return false;
        }

    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.previousState = null;
        this.nextState = null;
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
