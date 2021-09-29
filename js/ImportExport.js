"use strict"
import {LocalStorage} from "./LocalStorage.js";
import {List} from "./List.js";

export const exportToJSON = (evt)=>{
    const storage = new LocalStorage();
    const text = storage.get();
    const fileName = storage.listName.concat(".json")

    const file = new File([text], fileName, {type: "application/json"})
    evt.target.href = URL.createObjectURL(file);
    evt.target.download = file.name;
}

export const importFromJSON = () => {
    let input = document.createElement("input");
    input.type = "file";
    input.accept ="application/json";

    const warning = "Warning, this will overwrite the current list and reload the page.\n\nAre you sure you want to continue?"

    if (confirm(warning)) {
        input.click();
        input.onchange = handleDataLoad;
    }
}

const handleDataLoad = (evt) => {

    /** @type {HTMLInputElement} */
    const input = evt.target;
    const storage = new LocalStorage()
    input.files[0].text().then((d=>{
        storage.list = new List(JSON.parse(d))
        storage.updateStorage()
        window.location.reload();
    }))
}