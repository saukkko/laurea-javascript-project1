"use strict"
import { List } from "./List.js";
import { ListItem } from "./ListItem.js";

/**
 * @property list {List}
 * @property listName {string}
 * @property storage {Record<string,unknown>}
 * */
export class LocalStorage {
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

  updateStorage() {
    localStorage.setItem(this.listName, this.list);
    this.storage = JSON.parse(localStorage.getItem(this.listName));
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
   * @returns {string}
   */
  get() {
    this.updateStorage();
    return this.list.toString();
  }
}
