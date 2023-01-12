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


// db.promise().query("SELECT * FROM department")
//     .then(([department]) => {
//         console.table(department);
//     })
//     .catch(console.log);


inquirer
    .prompt([
        /* Pass your questions in here */
        {
            type: "list",
            name: "options",
            message: "Select one of the following",
            choices: [
                "View all departments",
                "View all roles",
                "View all employees",
                "Add a department",
                "Add a role",
                "Add an employee",
                "Update an employee role",
                "Quit"
            ]
        }
    ])
    .then((answers) => {
        // console.log(answers.options)
        department();
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


const department = ()=> {
    db.query(`SELECT * FROM department`, (err, res) => {
        if (err) {
            console.log(err);
        }
        console.table(res);
    });
}
