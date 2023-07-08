import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://realtime-database-79614-default-rtdb.europe-west1.firebasedatabase.app/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList");
const booksInDB = ref(database, "books");
const inputField = document.getElementById("input-field");
const addButton = document.getElementById("add-button");
const shoopingList = document.getElementById("shopping-list");

// using Enter key
inputField.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    addButton.click();
  }
});

///

addButton.addEventListener("click", function () {
  let inputValue = inputField.value;

  // this Check if the input field is not empty
  if (inputValue.trim() !== "") {
    push(shoppingListInDB, inputValue);

    clearInputField();

    // appendItem(inputValue);
  } else {
    shoopingList.innerHTML = "😉 أكتب ما تريد من فضلك";
  }

  ////
});

onValue(shoppingListInDB, function (snapshot) {
  if (snapshot.exists()) {
    let itemArray = Object.entries(snapshot.val());

    clearShoppingList();

    for (let i = 0; i < itemArray.length; i++) {
      let currentItem = itemArray[i];

      appendItem(currentItem);
    }
  } else {
    shoopingList.innerHTML = "السلة فارغة 😔";
  }
});

// Clear shopping list

function clearShoppingList() {
  shoopingList.innerHTML = "";
}

// Clear the input field when button is pressed
function clearInputField() {
  inputField.value = "";
}

// Append new item
function appendItem(item) {
  let itemID = item[0];
  let itemValue = item[1];
  let newEl = document.createElement("li");

  newEl.textContent = itemValue;

  // when clicked we delete item
  newEl.addEventListener("click", function () {
    // alert(itemID);
    let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`);

    remove(exactLocationOfItemInDB);
  });

  shoopingList.append(newEl);
}
