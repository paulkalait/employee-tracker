const mysql = require('mysql2')
const inquirer = require('inquirer')
const {printTable} = require("console-table-printer")

const db = mysql.createConnection(
    {
        host: 'localhost',
        // your MYSQL Username
        user: 'root',
        // password
        password: '',
        database: 'employees'
    },
    console.log('Connected to the employees database!')
)
const viewAllEmployees = () => {
    db.query('SELECT * FROM employee', function (err, results) {
        printTable(results);
        promptChoices();
      });
}

const viewAllDepartments = () => {
    db.query('SELECT * FROM department', function (err, results) {
        printTable(results);
        promptChoices();
      });
}

const viewAllRoles = () => {
    db.query('SELECT role.id, role.title, role.salary, department.department_name FROM role LEFT JOIN department ON role.department_id = department.id', function (err, results) {
        printTable(results);
        promptChoices();
      });
}

//use insert for the add functiions 
const addEmployee = () => {
    //prompt user with department
    inquirer.prompt([{
        type: "input",
        name: "firstname",
        message: "What is the employee's first name?"
    },
    {
        type: "input",
        name: "lastname",
        message: "What is the employee's last name?"
    },
    ])
    .then(answers => {
    })
}




// Prompt user 
const promptChoices = () => {
    inquirer.prompt([
        {
            name: 'choices',
            type: 'list',
            message: 'Please choose an option',
            choices: [
                "View all employees",
                "View all department",
                "View all roles",
                "Add a department",
                "Add a Role",
                "Add an Employee",
                "Update Employee Role",
                "None"
            ]
        }
    ])
    .then(
        res => {
            console.log(res)
            let userInput = res.choices
            if(userInput === "View all employees"){
                viewAllEmployees()
            }
            else if(userInput === "View all department"){
                viewAllDepartments();
            }
            else if(userInput === "View all roles"){
                viewAllRoles();
            }
            else if(userInput === "Add a department"){
                // addDepartment();
            }
            else if(userInput === "Add a Role"){
                // addRole();
            }
            else if(userInput === "Add an Employee"){
                // addEmployee();
            }
            else if(userInput === "Update Employee Role"){
                // updateEmployee();
            }
            else if(userInput === "None"){
                // None();
            }
        })
}


promptChoices();



