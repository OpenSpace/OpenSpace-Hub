import React, { useEffect } from 'react';

const EditItem = ({ item, editModal }) => {
  console.log(item);
  useEffect(() => {
    console.log('yo: ', item);
  });
  console.log('edit', editModal);
  return <div></div>;
};

export default EditItem;
