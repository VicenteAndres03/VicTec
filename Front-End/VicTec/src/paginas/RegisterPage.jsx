import React, { useState } from 'react';
import './ReportesPage.css'; // El CSS que ya creamos

function ReportesPage() {
  const [reporte, setReporte] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // 1. Nuevo estado para el botón de PDF
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState(null);


  // Simulación de llamada al backend para los 3 días
  const handleGenerarReporte = () => {
    setLoading(true);
    setReporte(null); 
    
    setTimeout(() => {
      // --- CAMBIOS AQUÍ (Datos en CLP) ---
      const datosReporte = {
        fechaInicio: '2025-10-31',
        fechaFin: '2025-11-02',
        ganancias: [
          { fecha: '2025-10-31', total: 450500 },
          { fecha: '2025-11-01', total: 320000 },
          { fecha: '2025-11-02', total: 510200 },
        ],
        totalGeneral: 1280700
      };
      
      setReporte(datosReporte);
      setLoading(false);
    }, 1500);
  };

  // --- 2. Nueva función para descargar el PDF ---
  const handleGenerarPDF = () => {
    setPdfLoading(true);
    setPdfError(null);

    fetch('http://localhost:8080/api/v1/admin/reportes/pdf/mensual')
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al generar el PDF en el servidor.');
        }
        return response.blob(); // Obtiene el archivo como un "blob"
      })
      .then(blob => {
        // Crea una URL temporal en el navegador para el archivo
        const url = window.URL.createObjectURL(blob);
        
        // Crea un enlace <a> invisible
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'Reporte-Mensual-VicTec.pdf'; // El nombre del archivo
        
        // Añade el enlace al cuerpo, haz clic y remuévelo
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
        
        setPdfLoading(false);
      })
      .catch(error => {
        console.error('Error al descargar el PDF:', error);
        setPdfError('No se pudo generar el PDF. Revisa la consola.');
        setPdfLoading(false);
      });
  };

  return (
    <main className="reportes-container">
      <div className="reportes-header">
        <h1 className="reportes-title">Panel de Administrador</h1>
        <p className="reportes-subtitle">Genera informes de ventas y ganancias.</p>
      </div>

      {/* --- Caja 1: Reporte 3 Días --- */}
      <div className="reportes-box">
        <div className="reporte-generator">
          <h3>Ganancias de los últimos 3 días</h3>
          <p>Presiona el botón para generar el informe más reciente.</p>
          <button 
            onClick={handleGenerarReporte} 
            className="reporte-button"
            disabled={loading}
          >
            {loading ? 'Generando...' : 'Generar Informe'}
          </button>
        </div>
        
        {/* (El resultado del reporte de 3 días se muestra aquí) */}
        {/* NOTA: Cuando construyas esta parte, recuerda formatear los números
          del reporte con .toLocaleString('es-CL')
        */}
        {reporte && ( <div className="reporte-resultado"> ... </div> )}
      </div>

      {/* --- 3. Caja 2: Reporte PDF Mensual --- */}
      <div className="reportes-box">
        <div className="reporte-generator">
          <h3>Informe Mensual (PDF)</h3>
          <p>Genera un PDF con el resumen de ganancias del mes actual.</p>
          <button 
            onClick={handleGenerarPDF} 
            className="reporte-button pdf-button" // Botón con estilo secundario
            disabled={pdfLoading}
          >
            {pdfLoading ? 'Generando PDF...' : 'Descargar PDF Mensual'}
          </button>
          
          {pdfError && <p className="reporte-error">{pdfError}</p>}
        </div>
      </div>
    </main>
  );
}

export default ReportesPage;