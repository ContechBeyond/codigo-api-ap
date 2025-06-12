import React, { useEffect, useState } from "react";

function CodigoPin() {
  const [pin, setPin] = useState("");

  const fetchPin = () => {
    fetch("https://pin-backend-byla.onrender.com/pin")
      .then(res => res.json())
      .then(data => {
        console.log("PIN recibido:", data.pin);
        setPin(data.pin);
      })
      .catch(err => console.error("Error al obtener el PIN:", err));
  };

  useEffect(() => {
    fetchPin(); // obtener el PIN al cargar
    const interval = setInterval(fetchPin, 5 * 60 * 1000); // cada 5 min

    return () => clearInterval(interval); // limpiar intervalo si el componente se desmonta
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>PIN actual:</h1>
      <p style={{ fontSize: "2.5rem", fontWeight: "bold" }}>
        {pin || "Cargando..."}
      </p>
    </div>
  );
}

export default CodigoPin;