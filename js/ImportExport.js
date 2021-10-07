"use strict";
import { hideError, showError, storage, validateInput } from "./main.js";
import { List } from "./List.js";

export const exportToJSON = (evt) => {
  // this is just for better readability during development.
  // change to `const text = storage.toString();`
  const text = JSON.stringify(storage.get(), null, 2);

  const fileName = storage.listName.concat(".json");

  const file = new File([text], fileName, { type: "application/json" });
  evt.target.href = URL.createObjectURL(file);
  evt.target.download = file.name;
};

export const importFromJSON = () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "application/json";
  input.click();
  input.onchange = handleDataLoad;
};

const handleDataLoad = (evt) => {
  const input = evt.target;
  const warning =
    "Warning, this will overwrite the current list.\n\nAre you sure you want to continue?";
  if (confirm(warning)) {
    input.files[0].text().then((d) => {
      try {
        const arr = JSON.parse(d);
        arr.forEach((x) => validateInput(x.taskValue, false, true)); // we need this to throw
      } catch (err) {
        if (err && err instanceof Error) {
          console.error(err);
          if (err instanceof SyntaxError && err.message.includes("JSON"))
            showError("JSON parsing failed.");
          else showError(err.message);
          return;
        }
      }
      hideError();
      storage.list = new List(JSON.parse(d));
      storage.updateStorage();
    });
  }
};
