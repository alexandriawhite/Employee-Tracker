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
                    })
                }
            })
        })
};



const addRole = () => {
    inquirer
        .prompt([
            /* Pass your questions in here */
            {
                type: "input",
                name: "title",
                message: "Enter role title"
            },
            {
                type: "input",
                name: "salary",
                message: "Enter salary"
            },
            {
                type: "input",
                name: "department_id",
                message: "Enter department ID"
            }
        ])
        .then((answers) => {
            db.query(`INSERT INTO role(title, salary, department_id) 
            VALUES(?,?,?)`, [answers.title, answers.salary, answers.department_id], (err, res) => {
                if (err) {
                    console.log(err);
                } else {
                    db.query(`SELECT 
                    r.title AS job_title,
                    r.id AS role_id,
                     d.name AS department,
                     r.salary
                     FROM role r
                     JOIN department d ON r.department_id = d.id
                     `, (err, res) => {
                        if (err) {
                            console.log(err);
                        }
                        console.table(res);
                    })
                }
            })
        })
};

const addEmployee = () => {
    inquirer
        .prompt([
            /* Pass your questions in here */
            {
                type: "input",
                name: "first_name",
                message: "Enter employee first name"
            },
            {
                type: "input",
                name: "last_name",
                message: "Enter employee last name"
            },
            {
                type: "input",
                name: "role_id",
                message: "Enter employee role ID"
            },
            {
                type: "input",
                name: "manager_id",
                message: "Enter employee manager",
            },
        ])
        .then((answers) => {
            db.query(`INSERT INTO employee(first_name, last_name, role_id, manager_id) 
        VALUES(?,?,?,?)`, [answers.first_name, answers.last_name, answers.role_id, answers.manager_id], (err, res) => {
                if (err) {
                    console.log(err);
                } else {
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
                    LEFT JOIN employee e2 ON e.manager_id = e2.id`, (err, res) => {
                        if (err) {
                            console.log(err);
                        }
                        console.table(res);
                    })
                }
            })
        })
};

const update = () => {
    const employee = () => db.promise().query(`
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
    LEFT JOIN employee e2 ON e.manager_id = e2.id`)
    .then((rows) => {
        let title = row[0].map(obj => obj.title);
        return title
    })
};