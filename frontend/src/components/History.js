import React from "react";
import styled from "styled-components";

function History() {
  return (
    <Hdiv>
      <h1>View your recent rides</h1>
    </Hdiv>
  );
}

const Hdiv = styled.div`
  display: block;
  padding: 20px;
  margin: 0px auto;
  outline: 10px solid goldenrod;
  height: 500px;

  h1 {
    font-family: "Titillium Web", sans-serif;
    border-radius: 1rem;
    display: block;
    outline: 3px solid black;
    margin: 0px auto;
    text-align: center;
    height: 400px;
    width: 50%;
  }
`;

export default History;
