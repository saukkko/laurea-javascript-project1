"use strict";
import {
  storage,
  renderTaskList,
  validateInput,
  isValidInput,
} from "./main.js";
import { ListItem } from "./ListItem.js";

/**
 * onkeydown event handler to accept enter button as send
 * @param {KeyboardEvent} evt
 */
export const handleInputKeydown = (evt) => {
  if (evt.key === "Enter") {
    const target = evt.target;

    //addRow(target.value);
    document.getElementById("add-button").firstChild.click();
    target.value = "";
  }
};

/**
 * oninput event handler to prevent adding unwanted input
 * @param {Event} evt
 */
export const handleInputChange = (evt) => {
  const target = evt.target;
  const maxLength = 15;

  if (target.value.length > maxLength) {
    target.value = target.value.slice(0, maxLength);
  }
  // validateInput(target);
};

/**
 * onclick event handler that reads event type from data-event attribute
 * @param {Event} evt
 */
export const handleClick = (evt) => {
  const dataset = evt.target.dataset;

  switch (dataset.event) {
    case "delete":
      storage.remove(dataset.key);
      break;

    case "add":
      const input = document.getElementById("task-input");
      validateInput(input);

      if (!isValidInput) {
        return;
      }

      storage.add(new ListItem(input.value, false));
      input.value = "";
      renderTaskList();
      break;

    case "done":
      storage.markDone(dataset.key);
      break;

    case "remove_done":
      storage.markDone(dataset.key);
      break;

    default:
      break;
  }
};