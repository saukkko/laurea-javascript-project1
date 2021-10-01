"use strict";
import { List } from "./List.js";
import { ListItem } from "./ListItem.js";

/**
 * @property list {List}
 * @property listName {string}
 * @property storage {ListItem[]}
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

  async updateStorage() {
    localStorage.setItem(this.listName, this.list);
    this.storage = JSON.parse(localStorage.getItem(this.listName));

    const { renderTaskList } = await import("./main.js");
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
   * @returns {string}
   */
  toString() {
    this.updateStorage();
    return JSON.stringify(this.storage);
  }

  /**
   * @returns {ListItem[]}
   */
  toJSON() {
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
    const newList = this.toJSON()
      .map((o) => {
        if (!o.isDone) return o;
      })
      .filter((d) => {
        if (d) return d;
      });

    this.list = new List(newList);
    this.updateStorage();
  }
}
