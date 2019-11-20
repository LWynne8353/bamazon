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
    //loadProducts();
    managerMenu();
});
function managerMenu() {
    var query = "SELECT * FROM products";
    connection.query(query, function (err, res) {
        if (err) throw err;
        managerOptions(res);
    });
}

function managerOptions(products) {
    inquirer
        .prompt({
            name: "menu",
            type: "list",
            message: "What would you like to do?",
            choices: ["view products", "check low inventory", "add to inventory", "add to products", "exit"]
        }).then(function (value) {
            switch (value.menu) {
                case "view products":
                    console.table(products)
                    managerMenu();
                    break;
                case "check low inventory":
                    checkLowInventory();
                    break;
                case "add to inventory":
                    addInventory();
                    break;
                case "add to products":
                    addProducts(products);
                    break;
                default:
                    console.log("End Session")
                    connection.end()
                    break
            }
        });
}
function checkLowInventory(products) {
    var query = "SELECT * FROM products WHERE stock_quantity <= 5";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res)
        managerMenu();
    });
}
function addInventory() {
    connection.query("SELECT * FROM products", function (err, res) {
        inquirer
            .prompt([{
                name: "choice",
                type: "rawlist",
                choices: function () {
                    var choices = [];
                    for (var i = 0; i < res.length; i++) {
                        choices.push(res[i].product_name)

                    }
                    return choices;
                },
                message: "what product would you like to update?",
            }, {
                name: "number",
                type: "input",
                message: "how much inventory to add?"
            }]).then(function (answer) {

                for (var i = 0; i < res.length; i++) {
                    if (res[i].product_name === answer.choice) {
                        var product = res[i].product_name;

                        var total = res[i].stock_quantity + answer.number;
                        console.log(total);
                        console.log(product);
                        var query = "UPDATE PRODUCTS SET product_id = stock_quantity + ?"; {
                            connection.query = (query, function (err, res) {
                                if (err) throw err;
                                console.log("Item has been updated")
                                managerMenu();


                            }
            }
                        console.log(answer.choice);
                        console.log(answer.number)





                        // var query = "UPDATE PRODUCTS SET product_id = stock_quantity + ?";{
                        // connection.query = (query, function (err, res) {
                        //     if (err) throw err;
                        //     console.log("Item has been updated")
                        //     managerMenu();
                    })

    })
}
function addProducts(products) {
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
}

