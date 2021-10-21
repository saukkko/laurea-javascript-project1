"use strict";
import { storage, hideError, showError, validateInput } from "./main.js";
import { List } from "./List.js";

/**
 * Export function that exports the contents of local storage to json-file
 * @param {MouseEvent} evt `onclick`event
 */
export const exportToJSON = (evt) => {
  // this is just for better readability. can be changed to: const text = storage.toString(); if needed.
  const text = JSON.stringify(storage.get(), null, 2);

  // set filename to <listname>.json. This is currently always TODO.json
  const fileName = storage.listName.concat(".json");

  // Construct the file object from text data, file name and content type.
  const file = new File([text], fileName, { type: "application/json" });

  // Creates the actual link where the file can be downloaded
  evt.target.href = URL.createObjectURL(file);

  // tell the browser what is the name of our file.
  evt.target.download = file.name;
};

/**
 * Imports json-file to task list.
 */
export const importFromJSON = () => {
  // when user clicks the link, first we create input element
  const input = document.createElement("input");

  // then we set it's type to file
  input.type = "file";

  // hint the browser what types of files we accept
  input.accept = "application/json";

  // then we "click" our newly created input button
  input.dispatchEvent(new MouseEvent("click"));

  // and add eventlistener to handle data loading
  input.onchange = handleDataLoad;
};

/**
 * Event handler for data loading (importing)
 * @param {Event} evt `onchange` event
 */
const handleDataLoad = (evt) => {
  /** @type {HTMLInputElement} */
  const input = evt.target;

  // set the warning message
  const warning =
    "Warning, this will overwrite the current list.\n\nAre you sure you want to continue?";

  // check if user accepts the warning
  if (confirm(warning)) {
    // we are only accepting one file so the index is always 0
    input.files[0].text().then((data) => {
      // we want to catch any errors that might occur
      try {
        // parse the json
        const arr = JSON.parse(data);

        // iterate over the array, validate all entries, print errors to error-box and throw if validation error occurs
        arr.forEach((x) => validateInput(x.taskValue, false, true));

        // catch errors
      } catch (err) {
        // give our IDE a hint that err variable is Error object
        if (err instanceof Error) {
          // log full errors to console
          console.error(err);

          // check if JSON parsing fails by checking if the Error object is SyntaxError and if it includes "JSON"
          if (err instanceof SyntaxError && err.message.includes("JSON"))
            showError("JSON parsing failed.");
          // if the Error is not JSON error, print the actual error message to error-box
          else showError(err.message);
          return;
        }
      }

      // if the imnport was successful, call hideError to hide possible previous errors
      hideError();

      // update the TaskStorage object with new list from imported data
      storage.list = new List(JSON.parse(data));

      // call updateStorage to write changes back to localstorage and re-render the page
      storage.updateStorage();
    });
  }
};
