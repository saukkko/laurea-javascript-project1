import { ListItem } from "./ListItem.js";

export class List {
  list;

  /**
   *
   * @param {Record<string,unknown>[]?} list
   */
  constructor(list) {
    this.list = list ?? [];
  }

  /**
   * @param {ListItem} listItem
   */
  addItem(listItem) {
    this.list.push(listItem);
  }

  /**
   * @param {number} index
   */
  removeItem(index) {
    this.list.splice(index, 1);
  }

  /**
   * @param {number} index
   * @param {ListItem} newValue
   */
  setItem(index,newValue) {
    this.list[index] = newValue;
  }

  /**
   * @param {number} index
   */
  toggleDone(index) {
    /** @type {ListItem} */
    const item = this.list[index];
    this.setItem(index,{
      taskValue: item.taskValue,
      isDone: !item.isDone
    })
  }

  /**
   * @returns {ListItem[]}
   */
  toJSON() {
    return this.list;
  }

  /**
   * @returns {string}
   */
  toString() {
    return JSON.stringify(this.list);
  }

}
