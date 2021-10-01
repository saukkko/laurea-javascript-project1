"use strict";
import { LocalStorage } from "./LocalStorage.js";
import { Row } from "./Row.js";
import { exportToJSON, importFromJSON } from "./ImportExport.js";
import {
  handleClick,
  handleInputChange,
  handleInputKeydown,
} from "./EventHandlers.js";

export const storage = new LocalStorage();
export var isValidInput = false;

/**
 * Creates input and button elements for inserting tasks
 */
const renderTaskInput = () => {
  const div = document.getElementById("input");
  const input = document.createElement("input");
  const button = document.createElement("button");
  const addIcon = Row.getMaterialIcon("add", null, handleClick);

  input.required = true;
  input.type = "text";
  input.id = "task-input";
  input.placeholder = "Add task";
  input.oninput = handleInputChange;
  input.onkeydown = handleInputKeydown;

  button.id = "add-button";

  div.appendChild(input); // insert <input> as a child of div#input
  div.appendChild(button); // insert <button> as child of div#input, after <input>
  button.appendChild(addIcon); // insert icon inside <button> element
};

/**
 * Creates the todo list `<li>`-elements and their children
 */
export const renderTaskList = () => {
  // find the #list (ul element)
  /** @type {HTMLUListElement} */
  const ul = document.getElementById("list");

  // create newItems array and fill it with <li> elements
  const newItems = storage.list.toJSON().map((o, i) => {
    return new Row(o.taskValue, o.isDone, i, handleClick);
  });

  // fill `<ul>` with `<li>` elements
  ul.replaceChildren(...newItems);

  // update task counter
  updateCounter();
};

const updateCounter = () => {
  const list = storage.list.toJSON();
  const count = list.length;
  let doneCount = 0;

  list.forEach((d) => {
    if (d.isDone) doneCount++;
  });

  const counter = document.getElementById("task-counter");
  counter.innerHTML = `Total tasks: ${count}<br />Tasks done: ${doneCount}`;
};

/**
 * Function to check if the input is valid
 * @param {HTMLInputElement} input
 * @param {boolean?} validateOnly
 */
export const validateInput = (input, validateOnly) => {
  const patterns = [
    {
      regex: /^$/,
      errorMsg: "Input can't be empty",
    },
    {
      regex: /^\d+$/,
      errorMsg: "Input must not contain only numbers",
    },
    {
      regex: /(^\s+.*$)|(^.*\s+$)/,
      errorMsg: "Input can't start or end with whitespace",
    },
    {
      regex: /^(.{1,2})$/,
      errorMsg: "Please type at least three characters",
    },
  ];

  setValidInput(true);
  patterns.forEach((p) => {
    if (input.value.match(p.regex)) {
      if (!validateOnly) showError(p.errorMsg);
      setValidInput(false);
    }
  });

  if (!isValidInput) {
    input.style.borderColor = "red";
    input.style.outlineColor = "red";
  } else {
    input.style.borderColor = "unset";
    input.style.outlineColor = "unset";
    if (!validateOnly) hideError();
  }
};

/**
 * TODO: Make prettier
 * Shows red error box if user tries to add invalid input
 * @param {string} msg error message to print
 */
const showError = (msg) => {
  const err = document.getElementById("error");
  const span = document.createElement("span");
  err.className = "error-box";
  span.innerText = msg;

  err.replaceChildren(span);
};

const hideError = () => {
  const err = document.getElementById("error");
  const span = err.lastChild;

  if (err.childElementCount === 0) return;
  err.removeChild(span);
  err.removeAttribute("class");
};

/**
 * Function for controlling input validity
 * @param {boolean} value
 */
const setValidInput = (value) => {
  isValidInput = value;
};

const init = () => {
  renderTaskInput();
  renderTaskList();
  updateCounter();

  // this is not pretty...
  const exportLink = document.getElementById("export");
  const importLink = document.getElementById("import");
  const resetLink = document.getElementById("reset");
  const removeDoneLink = document.getElementById("remove-done");
  exportLink.onclick = exportToJSON;
  importLink.onclick = importFromJSON;
  resetLink.onclick = () => storage.reset();
  removeDoneLink.onclick = () => storage.removeDone();
};

window.onload = init;
