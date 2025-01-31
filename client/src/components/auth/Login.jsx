import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../managers/authManager";
import { Button, Form, FormControl, FormGroup, FormLabel, Alert } from "react-bootstrap";

export default function Login({ setLoggedInUser }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [failedLogin, setFailedLogin] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password).then((user) => {
      if (!user) {
        setFailedLogin(true);
      } else {
        setLoggedInUser(user);
        navigate("/");
      }
    });
  };

  return (
    <div className="container" style={{ maxWidth: "500px" }}>
      <h3>Login</h3>
      {failedLogin && <Alert variant="danger">Login failed.</Alert>}
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <FormLabel>Email</FormLabel>
          <FormControl type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
        </FormGroup>
        <FormGroup>
          <FormLabel>Password</FormLabel>
          <FormControl type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </FormGroup>
        <Button variant="primary" className="my-2" type="submit">Login</Button>
      </Form>
      <p>Not signed up? Register <Link to="/register">here</Link></p>
    </div>
  );
}
