"use strict";
import { TaskStorage } from "./TaskStorage.js";
import { Row } from "./Row.js";
import { exportToJSON, importFromJSON } from "./ImportExport.js";
import {
  handleClick,
  handleInputChange,
  handleInputKeydown,
} from "./EventHandlers.js";

// construct the TaskStorage class where all the magic happens
export const storage = new TaskStorage();

// variable to keep track of the input validity, set to false at initialization
export var isValidInput = false;

/**
 * Creates input and button elements for inserting tasks
 */
const renderTaskInput = () => {
  // find where we will put the elements and create the children
  const div = document.getElementById("input");
  const input = document.createElement("input");
  const button = document.createElement("button");
  const addIcon = Row.getMaterialIcon("add", null, handleClick);

  // add attributes and event handlers
  input.required = true;
  input.type = "text";
  input.id = "task-input";
  input.placeholder = "Add task";
  input.oninput = handleInputChange;
  input.onkeydown = handleInputKeydown;

  button.id = "add-button";

  // insert as children
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

/**
 * Renders the extra tools
 */
const renderLinks = () => {
  const exportLink = document.getElementById("export");
  const importLink = document.getElementById("import");
  const resetLink = document.getElementById("reset");
  const removeDoneLink = document.getElementById("remove-done");
  const doneAllLink = document.getElementById("done-all");

  // add some event handlers
  exportLink.onclick = exportToJSON;
  importLink.onclick = importFromJSON;

  // and here we dont actually attach any handlers, but instead call the
  // functions directly when the event is fired
  resetLink.onclick = () => storage.reset();
  removeDoneLink.onclick = () => storage.removeDone();
  doneAllLink.onclick = () => storage.markAllDone();
};

/**
 * Function to update counter
 */
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
 * @param {string?} value value to validate
 * @param {boolean?} validateOnly set true if we only want to validate and not print out any errors
 * @param {boolean?} throwOnError set true if we want to throw an error if it occurs (will halt code execution if not caught properly)
 */
export const validateInput = (value, validateOnly, throwOnError) => {
  /** @type {HTMLInputElement} */
  const input = document.getElementById("task-input");

  // if value is not given in parameter or it's null or empty, read the value  from input
  value = value ?? input.value;

  // create new error object
  const err = new Error();

  // define patterns as RegExp when to catch errors and their error messages
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
      regex: /^.{1,2}$/,
      errorMsg: "Input must have at least three characters",
    },
    {
      regex: /^.{51,}$/,
      errorMsg: "Input can't exceed 50 characters",
    },
  ];

  // set valid input to true
  isValidInput = true;

  // iterate over our patterns...
  patterns.forEach((p) => {
    // ...check if our value matches the pattern...
    if (value.trim().match(p.regex)) {
      // ...if we are not validating only, print the error in error-box
      if (!validateOnly) showError(p.errorMsg);

      // set valid input to false
      isValidInput = false;

      // set error objects message to matching pattern error message
      err.message = p.errorMsg;
    }
  });

  // if the input is not valid...
  if (!isValidInput) {
    // ...style input border...
    input.style.borderColor = "red";
    input.style.outlineColor = "red";

    // ...and if we are throwing on error, throw it
    if (throwOnError) throw err;
  } else {
    // if the input is valid, unset any previous styles set to input
    input.style.borderColor = "unset";
    input.style.outlineColor = "unset";

    // if we are not only validating, hide the previous errors
    if (!validateOnly) hideError();
  }
};

/**
 * Shows red error-box if user tries to add invalid input
 * @param {string} msg error message to print
 */
export const showError = (msg) => {
  const err = document.getElementById("error");
  const span = document.createElement("span");
  err.className = "error-box";
  span.innerText = msg;

  err.replaceChildren(span);
};

/**
 * hides (removes) the error-box
 */
export const hideError = () => {
  const err = document.getElementById("error");
  const span = err.lastChild;

  if (err.childElementCount === 0) return;
  err.removeChild(span);
  err.removeAttribute("class");
};

/**
 * Initialize the page so it will look correct during first load.
 */
const init = () => {
  renderTaskInput();
  renderTaskList();
  renderLinks();
  updateCounter();
};

// call initializaion only after the window is fully loaded
window.onload = init;
