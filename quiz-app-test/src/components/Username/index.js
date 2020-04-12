import React, { useState } from "react";

function Username({ handleUsernameSubmit }) {
  const [username, setUsername] = useState("");
  function handleUsername(event) {
    const input = event.target.value;
    setUsername(input);
  }
  return (
    <div>
      <input
        type="text"
        placeholder="username"
        value={username}
        onChange={handleUsername}
      ></input>
      <button onClick={() => handleUsernameSubmit(username)}>Submit</button>
    </div>
  );
}

export default Username;
