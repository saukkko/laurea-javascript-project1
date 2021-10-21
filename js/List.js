"use strict";
import { ListItem } from "./ListItem.js";

/**
 * Class that adds and removes list items (todo tasks) to and from it. Can be
 * constructed with existing array of ListItems or as empty List.
 */
export class List {
  listItems;

  /**
   *
   * @param {ListItem[]?} list
   */
  constructor(list) {
    this.listItems = list ?? [];
  }

  /**
   * Trims leading and trailing spaces from ListItem and pushes it to the array (this List object)
   *
   * @param {ListItem} listItem
   */
  addItem(listItem) {
    listItem.taskValue = listItem.taskValue.trim();
    this.listItems.push(listItem);
  }

  /**
   * Removes the specified index from the array
   *
   * @param {number} index
   */
  removeItem(index) {
    this.listItems.splice(index, 1);
  }

  /**
   * sets the index with new value
   *
   * @param {number} index
   * @param {ListItem} newValue
   */
  setItem(index, newValue) {
    this.listItems[index] = newValue;
  }

  /**
   * Toggles done status for single index (currently unused)
   *
   * @param {number} index
   */
  toggleDone(index) {
    /** @type {ListItem} */
    const item = this.listItems[index];
    this.setItem(index, {
      taskValue: item.taskValue,
      isDone: !item.isDone,
    });
  }

  /**
   * @returns {ListItem[]}
   */
  toJSON() {
    return this.listItems;
  }

  /**
   * @returns {string}
   */
  toString() {
    return JSON.stringify(this.listItems);
  }
}
