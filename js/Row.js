"use strict";

/**
 * This class creates new `<li>` element for the `<ul>` element.
 *
 * @class Row
 * @property li {HTMLLIElement}
 * @property taskValue {string}
 * @property taskIndex {number}
 * @property isDone {boolean}
 * @property clickEventHandler {MouseEvent}
 */
export class Row {
  li;
  taskValue;
  taskIndex;
  isDone;
  eventHandler;

  /**
   *
   * @param taskValue {string}
   * @param isDone {boolean}
   * @param taskIndex {number}
   * @param eventHandler {MouseEvent}
   * @returns {HTMLLIElement}
   */
  constructor(taskValue, isDone, taskIndex, eventHandler) {
    this.li = document.createElement("li");
    this.taskValue = taskValue;
    this.taskIndex = taskIndex;
    this.isDone = isDone;
    this.eventHandler = eventHandler;

    this.appendChildren();

    return this.li;
  }

  /**
   * Creates li-element with three children. For example:
   * ```
   * <li>
   *   <span class="material-icons" data-event="done" data-key="0">done</span>
   *   <span class="task" data-key="0">task value</span>
   *   <span class="material-icons" data-event="delete" data-key="0">delete</span>
   * </li>
   * ```
   */
  appendChildren() {
    // destruct children as variables
    const { doneIcon, task, deleteIcon } = this.createChildren();

    // append li-element with children
    this.li.appendChild(doneIcon);
    this.li.appendChild(task);
    this.li.appendChild(deleteIcon);
  }

  /**
   * Creates child elements for parent `<li>` element. This is the actual row contents.
   * @returns Three different `<span>` elements
   */
  createChildren() {
    // create the elements
    const doneIcon = this.getMaterialIcon("done", this.taskIndex);
    const deleteIcon = this.getMaterialIcon("delete", this.taskIndex);
    const task = document.createElement("span");

    // set some properties for the `<span>` that holds the task information
    task.className = "task";
    task.innerText = this.taskValue;

    // adds data-index attribute
    task.dataset.index = this.taskIndex;

    // adds data-action attribute
    task.dataset.action = "done";

    // listen onclick events
    task.onclick = this.eventHandler;

    // if the task is done...
    if (this.isDone) {
      // ...decorate it with line-through...
      task.style.textDecoration = "line-through";

      // ...and make it more opaque
      task.style.opacity = "0.5";
    }

    // return the children as object
    return { doneIcon, task, deleteIcon };
  }

  /**
   * Calls static getMaterialIcon method with instance variable this.eventHandler
   *
   * @param {string} iconName Material Icon name
   * @param {number?} index Optional indexing to set
   * @returns {HTMLSpanElement}
   */
  getMaterialIcon(iconName, index) {
    return Row.getMaterialIcon(iconName, index, this.eventHandler);
  }

  /**
   * Method to create some fancy icons.
   *
   * @see https://fonts.google.com/icons?selected=Material+Icons
   *
   * @param {string} iconName
   * @param {number?} index
   * @param {GlobalEventHandlers?} eventHandler
   * @returns {HTMLSpanElement}
   */
  static getMaterialIcon(iconName, index, eventHandler) {
    // create new span element
    const icon = document.createElement("span");

    // set the class name as material-icons for them to work
    icon.className = "material-icons";

    // set the inner text to icon name to draw correct icon
    icon.innerText = iconName;

    // check if we have index parameter set and if it's actually a number, and set data-index to it
    if (typeof index === "number") icon.dataset.index = index;

    // check if we have event handler parameter...
    if (eventHandler) {
      // ... and attach it...
      icon.onclick = eventHandler;

      // ...and specify it's action name with the icon name
      icon.dataset.action = iconName;
    }

    // return the span element (icon)
    return icon;
  }
}
