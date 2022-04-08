const mysql = require('mysql2')
const inquirer = require('inquirer')

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

// Prompt user 
const promptChoices = () => {
    inquirer.prompt([
        {
            name: 'choices',
            type: 'list',
            message: 'Please choose an option',
            choices: [
                "View all employees",
                "View all deparment",
                "View all roles",
                "Add a department",
                "Add a Role",
                "Add an Employee",
                "Update Employee Role",
                "None"
            ]
        }
    ])
}