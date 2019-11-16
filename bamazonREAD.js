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
    loadProducts();
});
function loadProducts(){
    var query = "SELECT * FROM products";
    connection.query(query, function(err, res){
        if (err) throw err;
        console.table(res)
        promptCustomerItem(res)
    });
} 
function promptCustomerItem(inventory){
    inquirer
    .prompt({
        name: "choice",
        type: "input",
        message: "What product id would you like?"        
    }).then(function(answer){
        var id = parseInt(answer.choice);
       var product= checkInventory(id, inventory);
        if (product){
            //create function to prompt the customer for quantity 
            promptCustomerForQuantity(product)
        } else {
            console.log("Out of Stock");
            loadProducts();
        }
    });
}
function checkInventory(id, inventory){
            console.log(id)
        for (var i = 0; i < inventory.length; i++){
            if (inventory[i].id === id){
               // console.log(inventory[i])
                return inventory[i];
            }
        }
        return null;
} 
function promptCustomerForQuantity(product){
       // console.log("Enter quantity")
       inquirer
       .prompt({
           name: "quantity",
           type: "input",
           message: "How many would you like?"        
       }).then(function(value){
           var quantity = parseInt(value.quantity)
        if (quantity > product.stock_quantity){
            console.log("insuffient quantity")
            loadProducts()
        } else{
            makePurchase(product, quantity)
        }

       });
}
function makePurchase(product, quantity){
    connection.query("UPDATE PRODUCTS SET stock_quantity = stock_quantity - ? WHERE id = ?",
    [quantity, product.id], 
    function(err , res){
        console.log("Purchase was made, Thank you")
        loadProducts();
    })
}
//connection.end();