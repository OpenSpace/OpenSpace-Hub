import React, { useEffect } from 'react';
import { useState } from 'react';
import { Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import Dropdown from 'react-bootstrap/Dropdown';
import APIService from './APIService';


const EditItem = ({ item, editModal }) => {
  console.log(item);
  useEffect(() => {
    console.log("yo: ", item);
  })
  console.log("edit" , editModal);
  return (
    <div>
    </div>
  );
}

export default EditItem;
