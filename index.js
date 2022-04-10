const mysql = require("mysql2");
const inquirer = require("inquirer");
const { printTable } = require("console-table-printer");

let roles;
let employees;
let newTitle;
let newEmployeeId;

//establish connection to mysql server
const db = mysql.createConnection(
  {
    host: "localhost",
    // your MYSQL Username
    user: "root",
    // password
    password: "",
    database: "employees",
  },
  console.log("Connected to the employees database!")
);
const viewAllEmployees = () => {
  db.query("SELECT * FROM employee", function (err, results) {
    if(err) throw err
    printTable(results);
    promptChoices();
  });
};

const viewAllDepartments = () => {
  db.query("SELECT * FROM department", function (err, results) {
    if(err) throw err
    printTable(results);
    promptChoices();
  });
};

const viewAllRoles = () => {
  db.query(
    "SELECT role.id, role.title, role.salary, department.department_name FROM role LEFT JOIN department ON role.department_id = department.id",
    function (err, results) {
      printTable(results);
      promptChoices();
    }
  );
};
const getAllRoles = () => {
  return db
    .promise()
    .query(
      "SELECT role.id, role.title, role.salary, department.department_name FROM role LEFT JOIN department ON role.department_id = department.id"
    );
};
getAllRoles().then((results) => {
  roles = results[0];
});
const getAllEmployees = () => {
  return db.promise().query("SELECT * FROM employee;");
};
getAllEmployees().then((results) => {
  employees = results[0];
});

//use insert for the add functiions
const addEmployee = () => {
  //prompt user with department

  let firstname;
  let lastname;

  inquirer
    .prompt([
      {
        type: "input",
        name: "firstname",
        message: "What is the employee's first name?",
      },
      {
        type: "input",
        name: "lastname",
        message: "What is the employee's last name?",
      },
    ])

    .then((answers) => {
      firstname = answers.firstname;
      lastname = answers.lastname;

      db.promise().query(
        "SELECT role.id, role.title, role.salary, department.department_name FROM role LEFT JOIN department ON role.department_id = department.id"
      );

      let rolesChoices = roles.map(({ id, title }) => ({
        name: title,
        value: id,
      }));
      inquirer
        .prompt([
          {
            type: "list",
            name: "roleid",
            message: "What is your employee role",
            choices: rolesChoices,
          },
        ])
        .then((response) => {
          let roleid = response.roleid;
          // viewAllEmployees().then(([rows]) => {
          //     let employees = rows
          const managerChoices = employees.map(
            ({ id, first_name, last_name }) => ({
              name: `${first_name}${last_name}`,
              value: id,
            })
          );
          managerChoices.unshift({
            name: "None",
            value: null,
          });
          inquirer
            .prompt([
              {
                type: "list",
                name: "managerid",
                message: "Who is the employee's manager",
                choices: managerChoices,
              },
            ])
            .then((response) => {
              let employee = {
                first_name: firstname,
                last_name: lastname,
                role_id: roleid,
                manager_id: response.managerid,
              };
              const sql = `INSERT INTO employee SET ?`;
              db.query(sql, employee, (err, result) => {
                if(err) throw err;
                console.log(result);
              });
            })
            .then(() => {
              console.log(`EMPLOYEE ${firstname} ${lastname} ADDED TO DATABASE`);
            })
            .then(() => promptChoices());
        });
    });
};

//Add a department
const addDepartment = () => {
  inquirer.prompt([
    {
      name: 'addDepartment',
      type: 'input',
      message: 'What is the name of the new Department'
    }
  ])
  .then((answers) => {
    const sql = 'INSERT INTO department (department_name) VALUES (?)'
    db.query(sql, answers.addDepartment, (err, response) => {
      if(err) throw err;
      console.log(response)
      viewAllDepartments();
    }
    )
  })
}
// Add department function ends 

// Add a Role 
const addRole = () => {
  inquirer.prompt([
    {
      name:"addRole",
      type: 'input',
      message: "What is the name of the new Role"
    },
    {
      name: "addSalary",
      type: "input",
      message: 'Please enter salary amount'
    },
    {
      name: "addDepartment",
      type: 'list',
      // references the department keys
      message: 'Enter a department. Enter 1 for Engineering, 2 for Accounting, 3 for Sales, and 4 for Legal',
      choices: [1,2,3,4]
    }
  ])
  .then((answers) => {
    const sql = 'INSERT INTO role (role.title, role.salary, role.department_id) VALUES (?,?,?)'
    params = [answers.addRole, answers.addSalary, answers.addDepartment]
    db.query(sql, params, (err, response) => {
      if(err) throw err;
      console.log(response)
      promptChoices();
    })
  })
}


//update employee
const updateEmployee = () => {
                // from schema
  let sql = 'SELECT employee.id, employee.first_name, employee.last_name, role.id AS "role_id" FROM employee, role, department WHERE department.id = role.department_id AND role.id = employee.role_id'
  db.query(sql, (err, response) => {
    if(err) throw err;
    let employeesArr = []
    response.forEach((employee) => {employeesArr.push(`${employee.first_name}${employee.last_name}`)})
      // selecting role id and role title from role table
  let sql = 'SELECT role.id, role.title FROM role'
  db.query(sql, (err, response) => {
    if(err) throw err;
    let rolesArr = []
    // push the role table 'title' row values into the rolesArr -> insert the array into the prompts for 'choices'
    response.forEach((role) => {rolesArr.push(role.title)})

    inquirer.prompt([
      {
      name: 'selectedEmployee',
      type: 'list',
      message: "Which employee's role is being updated",
      choices: employeesArr
    },
    {
      name: 'selectedRole',
      type: 'list',
      message: "please select their new role",
      choices: rolesArr
    }
  ])
  .then((answers) => {

    response.forEach((role) => {
      if(answers.selectedRole == role.title){
        newTitle = role.id
      }
  
    })
    response.forEach((employee) => {
      if(answers.selectedEmployee == `${employee.firstname}${employee.lastname}`){
        
        newEmployeeId = employee.id
      }
    })

    let sql = 'UPDATE employee SET employee.role_id = ? WHERE employee.id = ? '
    params = [newTitle, newEmployeeId]
    db.query(sql, params, (err, result) => {
      if(err) throw err
      console.log(result)
      promptChoices();
    })
    
  })
  })
  })}
  

  


// Prompt user
const promptChoices = () => {
  inquirer
    .prompt([
      {
        name: "choices",
        type: "list",
        message: "Please choose an option",
        choices: [
          "View all employees",
          "View all department",
          "View all roles",
          "Add a department",
          "Add a Role",
          "Add an Employee",
          "Update Employee Role",
          "None",
        ],
      },
    ])
    .then((res) => {
      console.log(res);
      let userInput = res.choices;
      if (userInput === "View all employees") {
        viewAllEmployees();
      } else if (userInput === "View all department") {
        viewAllDepartments();
      } else if (userInput === "View all roles") {
        viewAllRoles();
      } else if (userInput === "Add a department") {
        addDepartment();
      } else if (userInput === "Add a Role") {
        addRole();
      } else if (userInput === "Add an Employee") {
        addEmployee();
      } else if (userInput === "Update Employee Role") {
        updateEmployee();
      } else if (userInput === "None") {
        //end sql connection
        db.end()
      }
    });
};

promptChoices();
