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

  constructor() {
    this.listName = "TODO";
    this.initialize();
  }

  initialize() {
    this.storage = JSON.parse(localStorage.getItem(this.listName));

    if (!this.storage) {
      const initialList = new List();
      localStorage.setItem(this.listName, initialList.toString());
      this.list = initialList;
    } else {
      this.list = new List(this.storage);
    }
    this.updateStorage();
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

  setAllDone() {
    this.list.toJSON().forEach((x,i) => this.set(i, new ListItem(x.taskValue,true)))
  }

  /**
   * @returns {ListItem[]}
   */
  get() {
    this.updateStorage();
    return this.storage;
  }

  reset() {
    const msg = `This will clear all contents from your list.\n\nType "delete" to confirm.`
    if (prompt(msg) === "delete"
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
