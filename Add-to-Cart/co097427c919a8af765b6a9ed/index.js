// Import functionalities on Firebase to connect with database on Firebase,
// By init the app on Firebase & get the database functions to able to read/write data on Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://realtime-database-df319-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)      // Create a variable to connect to Firebase database
const database = getDatabase(app)           // Retreive all database from Firebase-database
const shoppingListInDB = ref(database, "shoppingList")  // Set the reference point to a specific database

// Element VAR
const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")

addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value
    
    // Append data to specific database
    push(shoppingListInDB, inputValue)
    
    clearInputFieldEl()
})

// 'onValue' function would listen to anychange on the database,
// it will snapshot if the change occur, and we can refer to it later on
onValue(shoppingListInDB, function(snapshot) {
    if (snapshot.exists()) {                // If there's still at least one data in the specific database
        let itemsArray = Object.entries(snapshot.val())
    
        clearShoppingListEl()
        
        for (let i = 0; i < itemsArray.length; i++) {   // Loop to retreive all data from the specific database
            let currentItem = itemsArray[i]     // Retreive 'key', 'value' from database and convert to array
            let currentItemID = currentItem[0]  // Retreive only 'key' from database
            let currentItemValue = currentItem[1]   // Retreive only 'value' from database
            
            appendItemToShoppingListEl(currentItem)
        }      
    } else {                                        // If no data left in the specific database...  
        shoppingListEl.innerHTML = "No items here... yet"
    }
})

function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

function clearInputFieldEl() {
    inputFieldEl.value = ""
}

// Add new list-item from the input, and append to the database on firebase
// Remove item from the viewport & from database on firebase
function appendItemToShoppingListEl(item) {
    let itemID = item[0]
    let itemValue = item[1]
    
    let newEl = document.createElement("li")    // createElement is more powerful than insert element into 'innerHTML'
    
    newEl.textContent = itemValue
    
    newEl.addEventListener("click", function() {
        // Remove data from database by point to its specific database and ID
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
        
        remove(exactLocationOfItemInDB)
    })
    
    shoppingListEl.append(newEl)
}