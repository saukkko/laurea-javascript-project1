"use strict";
import {
  storage,
  renderTaskList,
  validateInput,
  isValidInput,
} from "./main.js";
import { ListItem } from "./ListItem.js";

/**
 * Event handler to accept enter button as send
 * @param {KeyboardEvent} evt `onkeydown` event
 */
export const handleInputKeydown = (evt) => {
  if (evt.key === "Enter") {
    const target = evt.target;

    // if user hits enter, we actually interpret that as mouseclick event
    document
      .getElementById("add-button")
      .firstChild.dispatchEvent(new MouseEvent("click"));
    target.value = "";
  }
};

/**
 * Event handler to prevent adding unwanted input and to detect illegal input during typing
 * @param {Event} evt `oninput` event
 */
export const handleInputChange = (evt) => {
  const target = evt.target;

  // set max length of input
  const maxLength = 50;

  // if input length is greater than allowed max length...
  if (target.value.length > maxLength) {
    // ...truncate any trailing characters
    target.value = target.value.slice(0, maxLength);
  }

  // and call the validation function with "validateOnly" parameter set to true
  validateInput(target.value, true);
};

/**
 * Event handler that reads command from data-action attribute of the event target
 * @param {MouseEvent} evt `onclick` event
 */
export const handleClick = (evt) => {
  const dataset = evt.target.dataset;

  // program logic to determine which function to call based on data-action attribute. Should be mostly self-explanatory .
  switch (dataset.action) {
    case "delete":
      storage.remove(dataset.index);
      break;

    case "add":
      const input = document.getElementById("task-input");
      validateInput(input.value);

      if (!isValidInput) {
        return;
      }

      storage.add(new ListItem(input.value, false));
      input.value = "";
      break;

    case "done":
      storage.markDone(dataset.index);
      break;

    default:
      break;
  }
};
