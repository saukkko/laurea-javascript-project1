"use strict";

/**
 * Simple class that only holds information of the tasks name and state. This
 * could be "downgraded" to simple object instead of being a class
 *
 * @property taskValue {string}
 * @property isDone {boolean}
 */
export class ListItem {
  taskValue;
  isDone;

  /**
   * @param {string} taskValue
   * @param {boolean} isDone
   * @returns {Record<string, string|boolean>}
   */
  constructor(taskValue, isDone) {
    this.taskValue = taskValue;
    this.isDone = isDone;

    return { taskValue: this.taskValue, isDone: this.isDone };
  }

  /**
   * @returns {string}
   */
  toString() {
    return JSON.stringify(this);
  }
}
