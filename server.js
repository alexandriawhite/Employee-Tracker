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

function main() {
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
            switch (answers.options) {
                case "View all departments":
                    department();
                    break;
                case "View all roles":
                    role();
                    break;
                case "View all employees":
                    employee();
                    break;
                case "Add a department":
                    addDepartment();
                    break;
                case "Add a role":
                    addRole();
                    break;
                case "Add an employee":
                    addEmployee();
                    break;
                case "Update an employee role":
                    update();
                    break;
                case "Quit":
                    console.log("Goodbye")
                    process.exit();
            }
        })
        .catch((error) => {
            if (error.isTtyError) {
                // Prompt couldn't be rendered in the current environment
            } else {
                // Something else went wrong
            }
        });
};

main();

// use async await instead of then
// promise the queries and make them their own functions 


const department = () => {
    db.query(`
    SELECT name AS department_name,
id AS department_id
    FROM department`, (err, res) => {
        if (err) {
            console.log(err);
        }
        console.table(res);
        main();
    });
}

const role = () => {
    db.query(`
    SELECT 
    r.title AS job_title,
    r.id AS role_id,
    d.name AS department,
    r.salary
    FROM role r
    JOIN department d ON r.department_id = d.id`, (err, res) => {
        if (err) {
            console.log(err);
        }
        console.table(res);
        main();
    });
}

//Need to correct manager - right now it is pulling as the person itself
const employee = () => {
    db.query(`
    SELECT e.id AS employee_id,
    e.first_name,
    e.last_name,
    r.title AS job_title,
    d.name AS department,
    r.salary, 
    IFNULL(concat(e2.first_name,' ',e2.last_name), concat(e.first_name, ' ', e.last_name)) AS manager
    FROM employee e
    LEFT JOIN role r ON e.role_id = r.id
    LEFT JOIN department d ON d.id = r.department_id
    LEFT JOIN employee e2 ON e.manager_id = e2.id`,
        (err, res) => {
            if (err) {
                console.log(err);
            }
            console.table(res);
            main();
        });
}



const addDepartment = () => {
    inquirer
        .prompt([
            /* Pass your questions in here */
            {
                type: "input",
                name: "addDepartment",
                message: "Enter department name",
            }
        ])
        .then((answers) => {
            db.query(`INSERT INTO department(name) VALUES(?)`, answers.addDepartment, (err, res) => {
                    if (err) {
                        console.log(err);
                    } else {
                        db.query(`
                SELECT name AS department_name,
                id AS department_id
                    FROM department`, (err, res) => {
                            if (err) {
                                console.log(err);
                            }
                            console.table(res);
                            main();
                        })
                    }
                })
        })
};



const addRole = () => {

};

const addEmployee = () => {

};

const update = () => {

};