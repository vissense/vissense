var STATES = {
    HIDDEN: [0, 'hidden'],
    VISIBLE: [1, 'visible'],
    FULLY_VISIBLE: [2, 'fullyvisible']
};

/**
 * @private
 * @function
 * @name newVisState
 * @memberof VisSense~VisState
 *
 * @param {Array} state A state definition consisting of a code and a
 * string representation.
 * @param {number} percentage A number between 0 and 1 which represents
 * the currently visible area of an element.
 * @param {VisSense~VisState} [previous] The previous state of the element.
 *
 * @returns {VisSense~VisState} A state object.
 *
 * @description Constructs and returns a state object.
 *
 * @example
 *
 * var visElement = VisSense(element);
 *
 * visElement.isHidden();
 * // => false
 *
 */
function newVisState(state, percentage, previous) {
    if (previous) {
        delete previous.previous;
    }

    return {
        code: state[0],
        state: state[1],
        percentage: percentage,
        previous: previous || {},
        fullyvisible: state[0] === STATES.FULLY_VISIBLE[0],
        visible: state[0] === STATES.VISIBLE[0] ||
        state[0] === STATES.FULLY_VISIBLE[0],
        hidden: state[0] === STATES.HIDDEN[0]
    };
}
/**
 * An object representing the visibility state of an element.
 *
 * @typedef  {Object} VisSense~VisState
 *
 * @property {number} code A number representation
 * of an visibility state. This is either 0, 1 or 2.
 * @property {string} state An string representation of an visibility state.
 * This is either 'hidden', 'visible' or 'fullyvisible'.
 * @property {number} percentage The visible percentage of the element.
 * @property {VisSense~VisState|{}} previous The previous state if any,
 * otherwise `{}` will be returned. This value's
 * `previous` property will always be deleted.
 * @property {boolean} fullyvisible `true` if the element is fully visible,
 * otherwise `false`.
 * @property {boolean} visible `true` if the element is visible, otherwise
 * `false`.
 * @property {boolean} hidden `true` if the element is hidden, otherwise
 * `false`.
 */
export default {
    /**
     * @static
     * @function
     * @name hidden
     * @memberof VisSense~VisState
     *
     * @param {number} percentage A number between 0 and 1 which represents
     * the currently visible area of an element.
     * @param {VisSense~VisState} [previous] The previous state of the element.
     *
     * @returns {VisSense~VisState} A state object representing
     * the state "hidden".
     */
    hidden: (percentage, previous) => newVisState(STATES.HIDDEN, percentage, previous),
    /**
     * @static
     * @function
     * @name visible
     * @memberof VisSense~VisState
     *
     * @param {number} percentage A number between 0 and 1 which represents
     * the currently visible area of an element.
     * @param {VisSense~VisState} [previous] The previous state of the element.
     *
     * @returns {VisSense~VisState} A state object representing
     * the state "visible".
     */
    visible: (percentage, previous) => newVisState(STATES.VISIBLE, percentage, previous),
    /**
     * @static
     * @function
     * @name fullyvisible
     * @memberof VisSense~VisState
     *
     * @param {number} percentage A number between 0 and 1 which represents
     * the currently visible area of an element.
     * @param {VisSense~VisState} [previous] The previous state of the element.
     *
     * @returns {VisSense~VisState} A state object representing
     * the state "fullyvisible".
     */
    fullyvisible: (percentage, previous) => newVisState(STATES.FULLY_VISIBLE, percentage, previous)
};
