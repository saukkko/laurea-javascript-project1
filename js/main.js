"use strict";
import { TaskStorage } from "./TaskStorage.js";
import { Row } from "./Row.js";
import { exportToJSON, importFromJSON } from "./ImportExport.js";
import {
  handleClick,
  handleInputChange,
  handleInputKeydown,
} from "./EventHandlers.js";

export const storage = new TaskStorage();
export var isValidInput = false; // this could be error object?

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
 * @param {string?} value
 * @param {boolean?} validateOnly
 * @param {boolean?} throwOnError
 */
export const validateInput = (value, validateOnly, throwOnError) => {
  /** @type {HTMLInputElement} */
  const input = document.getElementById("task-input");
  value = value ?? input.value;

  const err = new Error();

  const patterns = [
    {
      regex: /^$|^\s+$/,
      errorMsg: "Input can't be empty",
    },
    {
      regex: /^\d+$/,
      errorMsg: "Input must not contain only numbers",
    },
    {
      regex: /^(.{1,2})$/,
      errorMsg: "Input must have at least three characters",
    },
    {
      regex: /^(?:.){50,}$/,
      errorMsg: "Input can't exceed 50 characters",
    },
  ];

  setValidInput(true);
  patterns.forEach((p) => {
    if (value.match(p.regex)) {
      if (!validateOnly) showError(p.errorMsg);
      setValidInput(false);
      err.message = p.errorMsg;
    }
  });

  if (!isValidInput) {
    input.style.borderColor = "red";
    input.style.outlineColor = "red";
    if (throwOnError) throw err;
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
export const showError = (msg) => {
  const err = document.getElementById("error");
  const span = document.createElement("span");
  err.className = "error-box";
  span.innerText = msg;

  err.replaceChildren(span);
};

export const hideError = () => {
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
