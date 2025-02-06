import { Outlet, Route, Routes } from "react-router-dom";
import { AuthorizedRoute } from "./auth/AuthorizedRoute";
import Login from "./auth/Login";
import Register from "./auth/Register";
import NavBar from "./NavBar";
import CreateOrder from "./Orders/CreateOrder";
import { Container } from "react-bootstrap";
import { OrderList } from "./orders/OrderList";
import { EmployeeForm } from "./Employees/EmployeeForm";
import { useState } from "react";
import { EmployeeList } from "./Employees/EmployeeList";

export default function ApplicationViews({ loggedInUser, setLoggedInUser }) {
  const [edit, setEdit] = useState(false);
  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <NavBar
              loggedInUser={loggedInUser}
              setLoggedInUser={setLoggedInUser}
            />
            <Container className="pt-5">
              <Outlet />
            </Container>
          </>
        }
      >
        <Route
          index
          element={
            <AuthorizedRoute loggedInUser={loggedInUser}>
              <>Welcome</>
            </AuthorizedRoute>
          }
        />
        <Route path="/orders">
          <Route
            index
            element={
              <AuthorizedRoute loggedInUser={loggedInUser}>
                <OrderList />
              </AuthorizedRoute>
            }
          />
          <Route
            path="create"
            element={
              <AuthorizedRoute loggedInUser={loggedInUser}>
                <CreateOrder loggedInUser={loggedInUser} />
              </AuthorizedRoute>
            }
          />
          <Route
            path=":id"
            element={
              <AuthorizedRoute loggedInUser={loggedInUser}>
                View Order
              </AuthorizedRoute>
            }
          />
          <Route
            path=":id/edit"
            element={
              <AuthorizedRoute loggedInUser={loggedInUser}>
                <CreateOrder edit={true} loggedInUser={loggedInUser} />
              </AuthorizedRoute>
            }
          />
        </Route>
        <Route path="employees">
          <Route
            index
            element={
              <AuthorizedRoute loggedInUser={loggedInUser} roles={["Admin"]}>
                <EmployeeList />
              </AuthorizedRoute>
            }
          />
          <Route
            path=":id"
            element={
              <AuthorizedRoute loggedInUser={loggedInUser} roles={["Admin"]}>
                Employee Details
              </AuthorizedRoute>
            }
          />
          <Route
            path=":id/edit"
            element={
              <AuthorizedRoute loggedInUser={loggedInUser} roles={["Admin"]}>
                <EmployeeForm edit={true} setEdit={setEdit} />
              </AuthorizedRoute>
            }
          />
          <Route
            path="create"
            element={
              <AuthorizedRoute loggedInUser={loggedInUser} roles={["Admin"]}>
                <EmployeeForm edit={false} setEdit={setEdit} />
              </AuthorizedRoute>
            }
          />
        </Route>
        <Route
          path="login"
          element={<Login setLoggedInUser={setLoggedInUser} />}
        />
        <Route
          path="register"
          element={<Register setLoggedInUser={setLoggedInUser} />}
        />
      </Route>
      <Route path="*" element={<p>Whoops, nothing here...</p>} />
    </Routes>
  );
}
