"use strict";
import { List } from "./List.js";
import { ListItem } from "./ListItem.js";

/**
 * This class works as the "brains" for the whole app. It should be constructed
 * only once from the main.js and then exported.
 *
 * @class TaskStorage
 * @property list {List}
 * @property listName {string}
 * @property storage {ListItem[]}
 * */
export class TaskStorage {
  list;
  listName;
  storage;

  // constrcut the object without any arguments
  constructor() {
    // set list name as "TODO"
    this.listName = "TODO";

    // call initialize() to keep this constructor cleaner and simpler
    this.initialize();
  }

  /**
   * Method called during construction only
   */
  initialize() {
    // parse data from localstorage and store it insice instance variable
    this.storage = JSON.parse(localStorage.getItem(this.listName));

    // if the storage is empty...
    if (!this.storage) {
      // ...create new empty List object...
      const initialList = new List();

      // ...set localstorage contents with the newly created empty list...
      localStorage.setItem(this.listName, initialList.toString());

      // ...store the list inside this object
      this.list = initialList;
    } else {
      // if storage is not empty, set the object's list with contents from the storage
      this.list = new List(this.storage);
    }

    // update the storage
    this.updateStorage();
  }

  /**
   * synchronous (non-simultaneous) function to update localstorage whenever needed
   */
  async updateStorage() {
    // await import of renderTaskList function
    const { renderTaskList } = await import("./main.js");

    // set localstorage with list contents
    localStorage.setItem(this.listName, this.list);

    // update this object's copy of localstorage
    this.storage = JSON.parse(localStorage.getItem(this.listName));
    renderTaskList();
  }

  /**
   * Adds new task to the list and updates the localstorage
   * @param {ListItem} listItem
   */
  add(listItem) {
    this.list.addItem(listItem);
    this.updateStorage();
  }

  /**
   * Removes task from the list and updates the localstorage
   * @param {number} index
   */
  remove(index) {
    this.list.removeItem(index);
    this.updateStorage();
  }

  /**
   * Marks single task as done and updates the localstorage
   * @param {number} index
   */
  markDone(index) {
    this.list.toggleDone(index);
    this.updateStorage();
  }

  /**
   * Sets (Changes) single item from the task list and updates the localstorage
   * @param {number} index
   * @param {ListItem} newValue
   */
  set(index, newValue) {
    this.list.setItem(index, newValue);
    this.updateStorage();
  }

  /**
   * Marks all tasks as done.
   */
  markAllDone() {
    // iterate over each item in the list, and set all items done
    this.list
      .toJSON()
      .forEach((x, i) => this.set(i, new ListItem(x.taskValue, true)));
  }

  /**
   * Update local storage and returns up-to-date contents from it
   * @returns {ListItem[]}
   */
  get() {
    this.updateStorage();
    return this.storage;
  }

  /**
   * Resets the list by creating new empty List object and updating the storage
   *
   * KNOWN ISSUE: if user intentionally breaks the local storage manually, this
   * method cannot be called since browser will never load this class at all.
   * Only manually removing or fixing the local storage data fixes the issue.
   *
   * TODO: Implement this directly early into main.js so it's loaded even in
   * the case of errors, or into index.html
   */
  reset() {
    const msg = `This will clear all contents from your list.\n\nType "delete" to confirm.`;
    if (prompt(msg) === "delete") {
      this.list = new List();
      this.updateStorage();
    }
  }

  /**
   * Removes all items that are marked done from the list and update the storage
   */
  removeDone() {
    // set the contents of `list` with new List, that has isDone: true
    this.list = new List(this.storage.filter((x) => !x.isDone));
    this.updateStorage();
  }

  /**
   * Return contents of the storage as JSON string.
   * @returns {string}
   */
  toString() {
    return JSON.stringify(this.get());
  }
}
