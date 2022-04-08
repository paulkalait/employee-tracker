INSERT INTO department(department_name) VALUES
("Sales"), ("Finance"), ("Engineering"), ("Legal");

INSERT INTO role(title, salary, department_id) VALUES
("Software Engineer", 110,000, 1), ("Accountant", 60,000, 2), ("Salesperson", 80000, 3), ("Lawyer", 190000, 4);

INSERT INTO role(first_name, last_name, role_id, manager_id) VALUES
("Paul", "Kalaitzidis", 1, 1), ("Maja", "Wurfel", 1, NULL), ("Earl", "Yur", 2, 3), ("Leonel", "Messi", 4, 2)