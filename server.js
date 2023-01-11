// ? Example from 12-stu_connect-Node
// Import and require mysql2
const mysql = require('mysql2');
const inquirer = require('inquirer');

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username,
        user: 'root',
        // MySQL password
        password: 'Vanderbilt1',
        database: 'team_db'
    },
);

// // Query database
// db.query('SELECT * FROM department', function (err, results) {
//     console.table(results);
// });



db.promise().query("SELECT * FROM department")
  .then( ([rows,fields]) => {
    console.table(rows);
  })
  .catch(console.log);


inquirer
    .prompt([
        /* Pass your questions in here */
        {
            type: "list",
            name: "options",
            message: "Select one of the following",
            choices:[ "View departments",
            "View roles",
            "View employees",
            "Add department",
            "Add role",
            "Add employee",
            "Update employee role",
            "Cancel"
        ]
        }
    ])
    .then((answers) => {
        console.log(answers.options)
    })
    .catch((error) => {
        if (error.isTtyError) {
            // Prompt couldn't be rendered in the current environment
        } else {
            // Something else went wrong
        }
    });


    // use async await instead of then
    // promise the queries and make them their own functions 


    
