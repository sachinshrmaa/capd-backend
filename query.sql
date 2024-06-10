-- list students department and batch wise
SELECT students.roll_no, users.name, semesters.name AS semester
FROM students
JOIN users ON students.user_id = users.user_id
JOIN departments ON students.department_id = departments.department_id
JOIN batches ON students.batch_id = batches.batch_id
JOIN semesters ON students.semester_id = semesters.semester_id
WHERE departments.name = 'Computer Engineering'
  AND batches.name = '20-24';


-- list all teachers based on departments
SELECT users.name, users.email FROM teachers JOIN users ON teachers.user_id = users.user_id JOIN departments ON teachers.department_id = departments.department_id WHERE departments.name = 'Computer Engineering';


-- list all departments
select departments.name 
from departments;


-- list all batches
select batches.name 
from batches;


-- list all subjects
SELECT s.name, s.code FROM subjects s JOIN departments d ON s.department_id = d.department_id JOIN semesters sem ON s.semester_id = sem.semester_id WHERE d.name = $1 AND sem.name = $2