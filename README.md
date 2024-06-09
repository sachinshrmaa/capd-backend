# CAPD backend API

## API Endpoints

### Auth - `/api/v1/auth`

- Login - `LogIn` - `/login`

```
payload:
{
    "email":"sachin@sist.edu.in",
    "password":"123"
}
```

## Students

URL - `/api/v1/students`

- List all students - `ListAllStudents` - `/list-students`

```
payload:
{
    "department": "Computer",
    "batch": 2024,
}
```

## Teachers

URL - `/api/v1/teachers`

- List all teachers - `ListAllTeachers` - `/list-teachers`

```
payload:
{
    "department": "Computer",
}
```

## Subjects - `/api/v1/subjects`

- List all subjects - `ListAllSubjects` - `/list-subjects`

```
payload:
{
    "department": "Computer",
    "sem": 1,
}
```

- List all teachers assigned subjects - `ListTeachersSubjects` - /`list-teachers-subjects`

```
payload:
{
    "teacher": "Repshika",
}
```

## Batches - `/api/v1/batches`

- list all batches - `/list-batches`

```
payload:
{
    "department": "Computer",
}
```
