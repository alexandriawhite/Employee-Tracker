USE team_db;
INSERT INTO department (name)
VALUES  ("Marketing"),
("Finance"),
("HR");

INSERT INTO role (title, salary, department_id)
VALUES 
("Director of Marketing", 120000, 0001),
("CFO", 250000, 0002),
("VP HR", 150000, 0003);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
("Betty", "White", 1, NULL),
("John", "Smith",2, NULL),
("Karen", "Baker", 3,2);
