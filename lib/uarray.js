'use strict';

class UArray extends Array {
	/**
	 * Adds an element if it doesn't exist already.
	 * @param element
	 * @returns {boolean} - true if an element was added (i.e. the array was changed), false otherwise.
	 */
	_add (element) {
		const index = this.indexOf(element);
		if (index === -1) {
			this.push(element);
			return true;
		}
		return false;
	}

	/**
	 * Removes an element if it exists.
	 * @param element
	 * @returns {boolean} - true if an element was removed (i.e. the array was changed), false otherwise.
	 */
	_remove (element) {
		const index = this.indexOf(element);
		if (index !== -1) {
			this.splice(index, 1);
			return true;
		}
		return false;
	}
}

module.exports = UArray;