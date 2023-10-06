import React from "react";
import { useState, useEffect } from "react";

function Home() {
  const [data, setData] = useState("");

  async function getUsers() {
    try {
      const response = await fetch('http://localhost:8080//retrieveAllUser')
      const data = await response.json();
      console.log(data);
      if(!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error){
      console.error(error)
    }
  }
  getUsers();
  useEffect(() => {
    fetch('http://localhost:8080//retrieveAllUser')
      .then(response => response.json())
      .then(json => setData(json))
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      
    </div>
  );
}

export default Home;
