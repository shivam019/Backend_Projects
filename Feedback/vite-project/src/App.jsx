// Client (client/src/App.js)
import React, { useEffect, useState } from "react";
import io from "socket.io-client";

function App() {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/feedbacks")
      .then((res) => res.json())
      .then(setFeedbacks);

    const socket = io("http://localhost:4000");
    socket.on("feedback", (feedback) => {
      setFeedbacks((feedbacks) => [...feedbacks, feedback]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      {feedbacks.map((feedback, i) => (
        <p key={i}>{feedback.text}</p>
      ))}
    </div>
  );
}

export default App;
