import React, { useEffect, useState } from "react";
import io from "socket.io-client";

function CodigoPin() {
  const [pin, setPin] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("Conectando...");
  const [timeRemaining, setTimeRemaining] = useState(0);

  // Función para formatear el tiempo en MM:SS
  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    // Conectar al servidor de Socket.IO
    const socket = io("https://pin-backend-byla.onrender.com");

    // Manejar la conexión exitosa
    socket.on("connect", () => {
      console.log("Conectado al servidor");
      setConnectionStatus("Conectado");
    });

    // Manejar la desconexión
    socket.on("disconnect", () => {
      console.log("Desconectado del servidor");
      setConnectionStatus("Desconectado");
    });

    // Recibir el PIN actual cuando se conecta
    socket.on("currentPin", (data) => {
      console.log("PIN actual recibido:", data.pin);
      setPin(data.pin);
      setTimeRemaining(data.timeRemaining || 0);
    });

    // Recibir nuevos PINs automáticamente
    socket.on("newPin", (data) => {
      console.log("Nuevo PIN recibido:", data.pin);
      setPin(data.pin);
      setTimeRemaining(data.timeRemaining || 0);
    });

    // Manejar errores de conexión
    socket.on("connect_error", (error) => {
      console.error("Error de conexión:", error);
      setConnectionStatus("Error de conexión");
    });

    // Cleanup: desconectar cuando el componente se desmonte
    return () => {
      console.log("Desconectando socket...");
      socket.disconnect();
    };
  }, []);

  // Actualizar el tiempo restante cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(prevTime => {
        const newTime = prevTime - 1000;
        return newTime < 0 ? 0 : newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>PIN actual:</h1>
      <p style={{ fontSize: "2.5rem", fontWeight: "bold" }}>
        {pin || "Cargando..."}
      </p>
      <p style={{ fontSize: "1.2rem", marginTop: "20px", color: "#666" }}>
        Tiempo restante: {formatTime(timeRemaining)}
      </p>
    </div>
  );
}

export default CodigoPin;