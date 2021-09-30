"use strict";

/**
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
  clickEventHandler;

  /**
   *
   * @param taskValue {string}
   * @param isDone {boolean}
   * @param taskIndex {number}
   * @param handleClick {MouseEvent}
   * @returns {HTMLLIElement}
   */
  constructor(taskValue, isDone, taskIndex, handleClick) {
    this.li = document.createElement("li");
    this.taskValue = taskValue;
    this.taskIndex = taskIndex;
    this.isDone = isDone;
    this.clickEventHandler = handleClick;

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
    const { doneIcon, task, deleteIcon } = this.createChildren(); // destructor
    this.li.appendChild(doneIcon);
    this.li.appendChild(task);
    this.li.appendChild(deleteIcon);
  }

  /**
   * Creates child elements for parent `<li>` element. This is the actual row contents.
   * @returns Three different `<span>` elements
   */
  createChildren() {
    let doneIcon = this.getMaterialIcon("done", this.taskIndex);
    const deleteIcon = this.getMaterialIcon("delete", this.taskIndex);
    const task = document.createElement("span");

    task.className = "task";
    task.innerText = this.taskValue;
    task.dataset.key = this.taskIndex;
    task.dataset.event = "done";
    task.onclick = this.clickEventHandler;

    if (this.isDone) {
      task.style.textDecoration = "line-through";
      task.style.opacity = "0.5";
      doneIcon = this.getMaterialIcon("remove_done", this.taskIndex);
    }

    return { doneIcon, task, deleteIcon };
  }

  /**
   *
   * @param {string} iconName Material Icon name
   * @param {number?} index Optional indexing to set
   * @returns {HTMLSpanElement}
   */
  getMaterialIcon(iconName, index) {
    return Row.getMaterialIcon(iconName, index, this.clickEventHandler);
  }

  /**
   *
   * @param {string} iconName
   * @param {number?} index
   * @param {GlobalEventHandlers?} eventHandler
   * @returns {HTMLSpanElement}
   */
  static getMaterialIcon(iconName, index, eventHandler) {
    const icon = document.createElement("span");
    icon.className = "material-icons";
    icon.innerText = iconName;
    if (typeof index === "number") icon.dataset.key = index;
    if (eventHandler) {
      icon.onclick = eventHandler;
      icon.dataset.event = iconName;
    }

    return icon;
  }
}
