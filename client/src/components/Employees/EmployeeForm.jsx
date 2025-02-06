import { useEffect, useState } from "react";
import {
  getUserProfileById,
  newUserProfile,
  updateUserProfile,
} from "../../managers/userProfileManager";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Form, FormLabel, Placeholder } from "react-bootstrap";

export const EmployeeForm = ({ edit, setEdit }) => {
  const [employee, setEmployee] = useState({});
  const [newEmployee, setNewEmployee] = useState({
    firstName: "",
    lastName: "",
    address: "",
    email: "",
    userName: "",
    password: "",
    roles: ["Employee"],
  });

  const { id } = useParams();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (edit) {
      setEmployee((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setNewEmployee((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleUserRequest = (e) => {
    e.preventDefault();

    if (edit) {
      const updatedEmployee = {
        firstName: employee.firstName,
        lastName: employee.lastName,
        address: employee.address,
        roles: employee.roles,
        identityUser: {
          email: employee.email,
          userName: employee.userName,
        },
      };
      updateUserProfile(updatedEmployee, id).then(() =>
        navigate(`/employees/${id}`)
      );
    } else {
      newUserProfile(newEmployee).then((response) =>
        navigate(`/employees/${response.id}`)
      );
    }
  };

  useEffect(() => {
    edit ? getUserProfileById(id).then(setEmployee) : setEmployee(null);
  }, [id, edit]);
  return (
    <div className="container">
      <div className="header mt-4">
        {edit ? <h4>Edit Employee</h4> : <h4>Create Employee</h4>}
      </div>
      <Form>
        <Form.Group className="mb-4 mt-4" controlId="employee-firstName">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            name="firstName"
            type="text"
            required
            value={edit ? employee.firstName : newEmployee.firstName}
            placeholder={!edit ? "Enter First Name" : ""}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group className="mb-4" controlId="employee-lastName">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            name="lastName"
            required
            value={edit ? employee.lastName : newEmployee.lastName}
            placeholder={!edit ? "Enter Last Name" : ""}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group className="mb-4" controlId="employee-address">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            name="address"
            required
            value={edit ? employee.address : newEmployee.address}
            placeholder={!edit ? "Enter Address" : ""}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group className="mb-4" controlId="employee-email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="text"
            name="email"
            required
            value={edit ? employee.email : newEmployee.email}
            placeholder={!edit ? "Enter Email" : ""}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group className="mb-4" controlId="employee-userName">
          <Form.Label>User Name</Form.Label>
          <Form.Control
            type="text"
            name="userName"
            required
            value={edit ? employee.userName : newEmployee.userName}
            placeholder={!edit ? "Enter User Name" : ""}
            onChange={handleInputChange}
          />
        </Form.Group>
        {!edit ? (
          <Form.Group className="mb-3" controlId="employee-password">
            <FormLabel>Password</FormLabel>
            <Form.Control
              type="password"
              name="password"
              placeholder="Enter Password"
              required
              onChange={handleInputChange}
            />
          </Form.Group>
        ) : (
          ""
        )}
        <Form.Group
          controlId="admin-check"
          style={{ textAlign: "start", float: "right" }}
        >
          <Form.Check
            type="checkbox"
            label="Admin"
            checked={
              edit
                ? employee.roles?.includes("Admin")
                : newEmployee.roles?.includes("Admin")
            }
            onChange={(e) => {
              const employeeData = { ...employee };
              const newData = { ...newEmployee };
              if (e.target.checked) {
                employeeData.roles = ["Admin"];
                newData.roles = ["Admin"];
              } else {
                employeeData.roles = ["Employee"];
                newData.roles = ["Employee"];
              }
              setEmployee(employeeData);
              setNewEmployee(newData);
            }}
          />
        </Form.Group>
        <Form.Group>
          <Button onClick={(e) => handleUserRequest(e)}>Submit</Button>
        </Form.Group>
      </Form>
    </div>
  );
};
