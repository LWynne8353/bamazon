var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "penn",
    database: "bamazon_DB"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    managerMenu();
});

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
                    checkLowInventory()
                    break;

                case "add to inventory":
                    addInventory(products)
                    break;

                case "add to product":
                    createNewProduct(products)
                    break;
                default:
                    console.log("Session End")
                    connection.end();
                    break
            }
        });
}
function checkLowInventory(products) {
    var query = "SELECT * FROM products WHERE stock_quantity <= 5 ";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res)
        managerMenu();
    });
}
function addInventory(products) {
    inquirer
        .prompt({
            name: "choice",
            type: "input",
            message: "What product id would you like?"
        },
            {
                name: "quantity",
                type: "input",
                message: "How many would you like to add?"

            }).then(function (answer) {
                var answer = parseInt(answer.choice);
                connection.query("UPDATE PRODUCTS SET product_name + ? WHERE stock_quantity ?",
                    {
                    function (err) {
                        if (err) throw err;
                        console.log("Inventory has be updated");
                        managerMenu();
                    },
                    });
            },
                function createNewProduct(products) {
                    inquirer
                        .prompt([
                            {
                                name: "product",
                                type: "input",
                                message: "What is your new product?"
                            },
                            {
                                name: "department",
                                type: "input",
                                message: "What department does below too?"
                            },
                            {
                                name: "price",
                                type: "input",
                                message: "What is the cost of the products"
                            },
                            {
                                name: "stock",
                                type: "input",
                                message: "How many do we have for stock?",
                                validate: function (value) {
                                    if (isNaN(value) === false) {
                                        return true;
                                    }
                                    return false;
                                }
                            }
                        ])
                        .then(function (answer) {
                            // when finished prompting, insert a new item into the db with that info
                            connection.query(
                                "INSERT INTO products SET ?",
                                {
                                    product_name: answer.product,
                                    department_name: answer.department,
                                    price: answer.price || 0,
                                    stock_quantity: answer.stock || 0
                                },
                                function (err) {
                                    if (err) throw err;
                                    console.log("Product has been added to the inventory!");
                                    managerMenu();
                                }
                            )
                        });
                })
}
