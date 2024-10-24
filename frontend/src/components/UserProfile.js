import React, { useState, useEffect } from "react";
import { Form, Button, } from "react-bootstrap";
import "./../css/login.css";
import APIService from './APIService';
import { deleteUser, signOut } from "firebase/auth";
import { auth } from "../firebase";

const UserProfile = ({ user, setRedAlertMessage, setGreenAlertMessage }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [institution, setInstitution] = useState("");

  useEffect(
    () => {
      setName(user.name);
      setEmail(user.email);
      setUsername(user.username);
      setInstitution(user.institution);
    }, [user]
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    let text = "Do you want to save the changes?";
    if (window.confirm(text) == true) {
      await APIService.UpdateUser(user.username, name, email, institution)
        .then(resp => {
          if (resp.error) {
            throw (resp.error);
          }
          setGreenAlertMessage("Profile updated successfully");
        })
        .catch(error => {
          setRedAlertMessage("Error: " + error);
        });
    }
  };

  const deleteUserProfile = async () => {
    let text = "Do you want to delete your profile? All your hub items and user data will be lost.";
    if (window.confirm(text) == true) {
      await APIService.DeleteUser(user.username)
        .then(resp => {
          if (resp.error) {
            throw (resp.error);
          }
          deleteUser(auth.currentUser);
          setGreenAlertMessage("Profile deleted successfully");
          localStorage.clear();
          window.location.href = "/login";
        })
        .catch(error => {
          setRedAlertMessage("Error: " + error);
        });
    }
  }

  return (
    <div className="sign-in__wrapper">
      <div className="sign-in__backdrop"></div>
      <Form className="shadow p-4 bg-white rounded" onSubmit={handleSubmit}>
        <div className="h4 mb-2 text-center">Profile</div>
        {/* create a 2d table to show user profile such as name, email, username, institution  */}
        <Form.Group className="mb-2" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="name"
            value={name}
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-2" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-2" controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="username"
            value={username}
            placeholder="Username"
            disabled
            required
          />
        </Form.Group>
        <Form.Group className="mb-2" controlId="institution">
          <Form.Label>Institution</Form.Label>
          <Form.Control
            type="institution"
            value={institution}
            placeholder="Institution"
            onChange={(e) => setInstitution(e.target.value)}
            required
          />
        </Form.Group>
        <Button className="w-100" variant="primary" type="submit">
          Edit Profile
        </Button> &nbsp;
        <Button className="w-100" variant="danger" onClick={deleteUserProfile}>
          Delete Profile
        </Button>

      </Form>
    </div>
  );
};

export default UserProfile;
