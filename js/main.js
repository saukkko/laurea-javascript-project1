"use strict"
import { Row } from "./Row.js";
import { LocalStorage } from "./LocalStorage.js";
import { ListItem } from "./ListItem.js";
import {exportToJSON, importFromJSON} from "./ImportExport.js";

// Global variable that keeps track if input is valid
let isValidInput = false;
let storage = new LocalStorage();

/**
 * Function for controlling input validity
 * @param {boolean} value
 */
const setValidInput = (value) => {
  isValidInput = value;
};

/**
 * Returns `<span>` element with desired
 * @param {string} iconName material icon name eg. "add"
 * @param {number?} index (optional) creates data-key attribute with value of index
 * @returns for example, `<span class="material-icons" data-event="add">add</span>`
 */
const getMaterialIcon = (iconName, index) => {
  const icon = document.createElement("span");
  icon.className = "material-icons";
  icon.innerText = iconName;
  icon.onclick = handleClick;
  icon.dataset.event = iconName;
  if (typeof index === "number") icon.dataset.key = index;

  return icon;
};

/**
 * Creates input and button elements for inserting tasks
 */
const renderTaskInput = () => {
  const div = document.getElementById("input");
  const input = document.createElement("input");
  const button = document.createElement("button");
  const addIcon = getMaterialIcon("add");

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
const renderTaskList = () => {
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
  let doneCount=0;

  list.forEach((d)=>{
    if (d.isDone) doneCount++;
  });

  const counter = document.getElementById("task-counter")
  counter.innerHTML = `Total tasks: ${count}<br />Tasks done: ${doneCount}`;
};

/**
 * Function to check if the input is valid
 * @param {HTMLInputElement} element
 */
const validateInput = (element) => {
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
  patterns.forEach((obj) => {
    if (element.value.match(obj.regex)) {
      showError(obj.errorMsg);
      setValidInput(false);
    }
  });

  if (!isValidInput) {
    element.style.borderColor = "red";
    element.style.outlineColor = "red";
  } else {
    element.style.borderColor = "unset";
    element.style.outlineColor = "unset";
    hideError();
  }
};

/**
 * onkeydown event handler to accept enter button as send
 * @param {KeyboardEvent} evt
 */
const handleInputKeydown = (evt) => {
  if (evt.key === "Enter") {
    const target = evt.target;

    addRow(target.value);
    target.value = "";
  }
};

/**
 * oninput event handler to prevent adding unwanted input
 * @param {Event} evt
 */
const handleInputChange = (evt) => {
  const target = evt.target;

  if (target.value.length > 20) {
    target.value = target.value.slice(0, 20);
  }
  // validateInput(target);
};

/**
 * onclick event handler that reads event type from data-event attribute
 * @param {Event} evt
 */
const handleClick = (evt) => {
  const dataset = evt.target.dataset;

  switch (dataset.event) {
    case "delete":
      deleteRow(dataset.key);
      break;

    case "add":
      const input = document.getElementById("task-input");
      addRow(input.value);
      input.value = "";
      break;

    case "done":
      //storage.done(dataset.key)
      toggleDone(dataset.key);
      break;

    case "remove_done":
      //storage.done(dataset.key)
      toggleDone(dataset.key);
      break;

    default:
      break;
  }
};



/**
 * Adds new row to the list
 * @param {string} val value to add
 */
const addRow = (val) => {
  const input = document.getElementById("task-input");
  validateInput(input);

  if (val !== input.value) {
    showError("input value mismatch");
    return;
  }
  if (!isValidInput) {
    return;
  }

  /*
  if (!list) {
    createList(val);
  } else {
    list.push({ value: val, done: false });
    storage.add(new ListItem(val, false));
    setList(list);
  }
  */
  storage.add(new ListItem(val, false));
  renderTaskList();
};

/**
 * TODO: Remove redundancy.
 * Deletes row with specified index
 * @param {number} index index to remove
 */
const deleteRow = (index) => {
  storage.remove(index);
  setList();
};

/**
 * TODO: Redundancy
 * Sets tasks as done or unsets it.
 * @param {number} index index to toggle done
 */
const toggleDone = (index) => {
  storage.markDone(index)
  setList();
};


/**
 * TODO: This function seems really weird, is it entirely necessary?
 * Saves the the list into localstorage
 */
const setList = () => {
  storage.updateStorage()
  setValidInput(false);
  renderTaskList();
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


const init = () => {
  renderTaskInput();
  renderTaskList();
  updateCounter();
}
window.onload = init;


/*
TODO:
  - isolate in their own methods
  - update import link every time list updates
*/

/** @type {HTMLAnchorElement} */
const exportLink = document.getElementById("export")

exportLink.onclick = exportToJSON;

/** @type {HTMLAnchorElement} */
const importLink = document.getElementById("import");
importLink.onclick = importFromJSON;

