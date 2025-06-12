import React, { useEffect, useState } from "react";

function CodigoPin() {
  const [pin, setPin] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(0);

  const fetchPin = () => {
    fetch("https://pin-backend-byla.onrender.com/pin")
  .then(res => res.json())
  .then(data => {
    console.log("PIN recibido:", data.pin);
    // aquí actualizas estado o lo que necesites
  });
  };

  const calculateSecondsLeft = () => {
    const now = new Date();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const minutesPassed = minutes % 5;
    const secondsPassed = minutesPassed * 60 + seconds;
    const secondsUntilNextChange = 5 * 60 - secondsPassed;
    setSecondsLeft(secondsUntilNextChange);
  };

  useEffect(() => {
    fetchPin();
    calculateSecondsLeft();

    const pinInterval = setInterval(fetchPin, 5 * 60 * 1000);
    const timerInterval = setInterval(calculateSecondsLeft, 1000);

    return () => {
      clearInterval(pinInterval);
      clearInterval(timerInterval);
    };
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>PIN actual:</h1>
      <p style={{ fontSize: "2.5rem", fontWeight: "bold" }}>{pin}</p>
      <p>Nuevo PIN en: {formatTime(secondsLeft)}</p>
    </div>
  );
}

export default CodigoPin;
