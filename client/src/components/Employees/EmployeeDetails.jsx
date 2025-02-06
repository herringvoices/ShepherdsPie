import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  deleteUserProfile,
  getUserProfileById,
} from "../../managers/userProfileManager";
import { Button, Card, Modal } from "react-bootstrap";
import "../../styles/employees.css";

export const EmployeeDetails = () => {
  const [employee, setEmployee] = useState({});
  const [show, setShow] = useState(false);

  const { id } = useParams();

  const navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    getUserProfileById(id).then(setEmployee);
  }, [id]);

  const handleDeleteEmployee = () => {
    deleteUserProfile(id).then(() => navigate("/employees"));
  };

  return (
    <div className="container">
      <h1 className="mt-5">Employee Details</h1>
      <Card className="mt-5 employee-details-card">
        <Card.Title>
          <h2>{employee.firstName + " " + employee.lastName}</h2>
        </Card.Title>

        <Card.Body>
          <Card.Text>
            <strong>Address:</strong> {employee.address}
          </Card.Text>
          <Card.Text>
            <strong>Email:</strong> {employee.email}
          </Card.Text>
          <Card.Text>
            <strong>Current Role: </strong>
            {employee.roles}
          </Card.Text>
          <Button
            variant="primary"
            className="me-2"
            onClick={() => navigate(`/employees/${id}/edit`)}
          >
            Edit
          </Button>
          <Button variant="danger" onClick={() => setShow(true)}>
            Delete
          </Button>
        </Card.Body>
      </Card>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            Delete {employee.firstName + " " + employee.lastName}?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this employee?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={() => {
              setShow(false);
              handleDeleteEmployee(id);
            }}
          >
            Delete
          </Button>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
