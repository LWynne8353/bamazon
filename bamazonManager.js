// var mysql = require("mysql");
// var inquirer = require("inquirer");

// var connection = mysql.createConnection({
//     host: "localhost",

//     // Your port; if not 3306
//     port: 3306,

//     // Your username
//     user: "root",

//     // Your password
//     password: "penn",
//     database: "bamazon_DB"
// });

// connection.connect(function (err) {
//     if (err) throw err;
//     console.log("connected as id " + connection.threadId + "\n");
//     managerMenu();
// });

function managerMenu() {
    var query = "SELECT * FROM products";
    connection.query(query, function (err, res) {
        if (err) throw err;
        managerOptions(res)
    });
}

function managerOptions(products) {
    inquirer
        .prompt({
            name: "menu",
            type: "list",
            message: "What would like to view?",
            choices: ["view products", "view low inventory", "add to inventory", "add to product", "exits"]
        }).then(function (value) {
            switch (value.menu) {
                case "view products":
                    console.table(products)
                    managerMenu();
                    break;
                case "view low inventory":
                    checkLowInventory();
                    break;

                case "add to inventory":
                    addInventory(products);
                    break;

                case "add to product":
                    createNewProduct(products);
                    break;
                default:
                    console.log("Session End");
                    connection.end();
                    break
            }
        });
}
function checkLowInventory(products){
    var query = "SELECT * FROM products WHERE stock_quantity <= 5 ";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res)
        managerMenu();
    });
}
function addInventory(products){
    inquirer
    .prompt({
        name: "choice",
        type: "input",
        message: "What product id would you like?"
    }).then(function (answer) {
        var id = parseInt(answer.choice);
        var product = checkInventory(id, inventory);
        if (product) {
            //create function to prompt the customer for quantity 
            promptManagerForQuantity(product)
        } else {
            console.log("Item is not inventory");
            managerMenu();
        }
    });
}
    
//check inventory to see if item is in stock 
function checkInventory(id, inventory) {
    console.log(id)
    for (var i = 0; i < inventory.length; i++) {
        if (inventory[i].id === id) {
            // console.log(inventory[i])
            return inventory[i];
        }
    }
    return null;
}
function promptManagerForQuantity(product) {
    // console.log("Enter quantity")
    inquirer
        .prompt({
            name: "quantity",
            type: "input",
            message: "How many would you like?"
        }).then(function (value) {
            var quantity = parseInt(value.quantity)
        });
}
