console.log("js loaded");

const fs = require("fs");

const snakeCase = (string) => {
  return string
    .replace(/\W+/g, " ")
    .split(/ |\B(?=[A-Z])/)
    .map((word) => word.toLowerCase())
    .join("_");
};

const recipe_list = document.querySelector("#recipe-list");
fetch("./recipes.json")
  .then((res) => res.json())
  .then((recipes) =>
    Object.entries(recipes).forEach(([recipe, ingredients]) => {
      const recipe_item = document.createElement("li");
      recipe_item.appendChild(document.createTextNode(recipe));
      recipe_item.classList.add("recipe-item");
      recipe_item.setAttribute("draggable", true);
      recipe_item.setAttribute("id", snakeCase(recipe));
      recipe_list.appendChild(recipe_item);
      recipe_item.addEventListener("dragstart", handleDragStart);
      recipe_item.addEventListener("dragend", handleDragEnd);
    })
  );

const meals_container = document.querySelector("#meals-container");
meals_container.addEventListener("dragenter", handleDragEnter);
meals_container.addEventListener("dragover", handleDragOver);
meals_container.addEventListener("dragleave", handleDragLeave);
meals_container.addEventListener("drop", handleDrop);

function handleDragEnter(e) {
  e.preventDefault();
  e.target.classList.add("drag-over");
}

function handleDragOver(e) {
  e.preventDefault();
  e.target.classList.add("drag-over");
}

function handleDragLeave(e) {
  e.target.classList.remove("drag-over");
}

function handleDrop(e) {
  e.target.classList.remove("drag-over");

  const id = e.dataTransfer.getData("text/plain");
  const clone = document.getElementById(id).cloneNode(true);
  const clone_id = clone.id;

  //check if recipe is already in meals list
  const clone_exists =
    document.querySelector(`#${clone_id}-clone`) === null ? false : true;

  if (clone_exists) {
    return false;
  }

  clone.removeAttribute("draggable");
  clone.setAttribute("id", `${clone_id}-clone`);

  e.target.querySelector("#meals-list").appendChild(clone);
  clone.classList.remove("dragged");

  let fInput = "test";

  fs.writeFile("test.txt", fInput, (err) => {
    if (err) throw err;
    else {
      console.log("file written");
    }
  });
}

function handleDragStart(e) {
  e.target.classList.add("dragged");
  e.dataTransfer.setData("text/plain", e.target.id);
}

function handleDragEnd(e) {
  e.target.classList.remove("dragged");
}
