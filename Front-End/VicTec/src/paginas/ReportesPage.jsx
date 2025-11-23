import React, { useState } from "react";
import { useAuth } from "../context/AuthContext"; // 1. Importar el contexto de autenticación
import "./ReportesPage.css";

function ReportesPage() {
  // 2. Obtener la función para crear los headers con el Token
  const { getAuthHeader } = useAuth();

  const [reporte, setReporte] = useState(null);
  const [loading, setLoading] = useState(false);

  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState(null);

  // Simulación de reporte en pantalla (sin cambios)
  const handleGenerarReporte = () => {
    setLoading(true);
    setReporte(null);

    setTimeout(() => {
      const datosReporte = {
        fechaInicio: "2025-10-31",
        fechaFin: "2025-11-02",
        ganancias: [
          { fecha: "2025-10-31", total: 450.5 },
          { fecha: "2025-11-01", total: 320.0 },
          { fecha: "2025-11-02", total: 510.2 },
        ],
        totalGeneral: 1280.7,
      };

      setReporte(datosReporte);
      setLoading(false);
    }, 1500);
  };

  // --- Función Corregida para Descargar PDF ---
  const handleGenerarPDF = () => {
    setPdfLoading(true);
    setPdfError(null);

    // 3. Usamos la ruta relativa y añadimos los headers con el token
    fetch("/api/v1/admin/reportes/pdf/mensual", {
      method: "GET",
      headers: getAuthHeader(), // <--- ¡ESTA ES LA CLAVE!
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Error al generar el PDF. Verifica que seas Administrador."
          );
        }
        return response.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = "Reporte-Mensual-VicTec.pdf";

        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();

        setPdfLoading(false);
      })
      .catch((error) => {
        console.error("Error al descargar el PDF:", error);
        setPdfError(error.message);
        setPdfLoading(false);
      });
  };

  return (
    <main className="reportes-container">
      <div className="reportes-header">
        <h1 className="reportes-title">Panel de Administrador</h1>
        <p className="reportes-subtitle">
          Genera informes de ventas y ganancias.
        </p>
      </div>

      {/* Caja 1: Reporte Pantalla */}
      <div className="reportes-box">
        <div className="reporte-generator">
          <h3>Ganancias de los últimos 3 días</h3>
          <p>Presiona el botón para generar el informe más reciente.</p>
          <button
            onClick={handleGenerarReporte}
            className="reporte-button"
            disabled={loading}
          >
            {loading ? "Generando..." : "Generar Informe"}
          </button>
        </div>
        {reporte && <div className="reporte-resultado"> ... </div>}
      </div>

      {/* Caja 2: Reporte PDF Mensual */}
      <div className="reportes-box">
        <div className="reporte-generator">
          <h3>Informe Mensual (PDF)</h3>
          <p>Genera un PDF con el resumen de ganancias del mes actual.</p>
          <button
            onClick={handleGenerarPDF}
            className="reporte-button pdf-button"
            disabled={pdfLoading}
          >
            {pdfLoading ? "Generando PDF..." : "Descargar PDF Mensual"}
          </button>

          {pdfError && <p className="reporte-error">{pdfError}</p>}
        </div>
      </div>
    </main>
  );
}

export default ReportesPage;
