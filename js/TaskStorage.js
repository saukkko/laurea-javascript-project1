"use strict";
import { List } from "./List.js";
import { ListItem } from "./ListItem.js";

/**
 * @property list {List}
 * @property listName {string}
 * @property storage {ListItem[]}
 * */
export class TaskStorage {
  list;
  listName;
  storage;

  /**
   * @param {string?} listName
   * @param {List?} list
   */
  constructor(listName, list) {
    this.listName = listName ?? "todo";
    list ? (this.list = list) : this.initialize();
    this.updateStorage();
  }

  initialize() {
    this.storage = JSON.parse(localStorage.getItem(this.listName));

    if (!this.storage) {
      let initList = new List();
      localStorage.setItem(this.listName, initList.toString());
      this.list = initList;
    } else {
      this.list = new List(this.storage);
    }
  }

  async updateStorage() {
    const { renderTaskList } = await import("./main.js");

    localStorage.setItem(this.listName, this.list);
    this.storage = JSON.parse(localStorage.getItem(this.listName));
    renderTaskList();
  }

  /**
   * @param {ListItem} listItem
   */
  add(listItem) {
    this.list.addItem(listItem);
    this.updateStorage();
  }

  /**
   * @param {number} index
   */
  remove(index) {
    this.list.removeItem(index);
    this.updateStorage();
  }

  markDone(index) {
    this.list.toggleDone(index);
    this.updateStorage();
  }

  set(index, newValue) {
    this.list.setItem(index, newValue);
    this.updateStorage();
  }

  /**
   * @returns {ListItem[]}
   */
  get() {
    this.updateStorage();
    return this.storage;
  }

  reset() {
    if (
      confirm(
        `This will reset your list named "${this.listName}"\n\nAre you sure?`
      )
    ) {
      this.list = new List();
      this.updateStorage();
    }
  }

  removeDone() {
    this.list = new List(this.storage.filter((x) => !x.isDone));
    this.updateStorage();
  }

  /**
   * @returns {string}
   */
  toString() {
    return JSON.stringify(this.get());
  }
}
