package ViDev.Victec.Controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// Importaciones para crear el PDF
import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import com.lowagie.text.Document;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;

@RestController
@RequestMapping("/api/v1/admin/reportes")
public class ReportesController {

    @GetMapping("/pdf/mensual")
    public ResponseEntity<byte[]> generarPdfMensual() {
        try {
            // --- 1. Aquí iría tu lógica de Base de Datos ---
            // (Ej: `List<Venta> ventas = ventaRepository.findAllByMesActual()`)
            // Por ahora, simularemos los datos:
            
            // --- CAMBIOS AQUÍ (Tipo de dato y valor) ---
            long gananciaMes = 15320750; 
            String mesActual = LocalDate.now().format(DateTimeFormatter.ofPattern("MMMM, yyyy"));

            // --- 2. Crear el PDF en memoria ---
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            Document document = new Document();
            PdfWriter.getInstance(document, out);
            
            document.open();
            
            // Título
            document.add(new Paragraph("Reporte Mensual de Ganancias - VicTec"));
            document.add(new Paragraph(" ")); // Espacio
            
            // Contenido
            document.add(new Paragraph("Mes del Reporte: " + mesActual));
            // --- CAMBIO AQUÍ (Añadido "CLP$ ") ---
            document.add(new Paragraph("Total de Ganancias (Simulación): CLP$ " + gananciaMes));
            document.add(new Paragraph(" "));
            document.add(new Paragraph("(Este es un reporte de ejemplo generado por el sistema)"));
            
            document.close();

            // --- 3. Preparar la Respuesta HTTP ---
            byte[] pdfBytes = out.toByteArray();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            // Esto le dice al navegador que "descargue" el archivo con este nombre
            headers.setContentDispositionFormData("attachment", "Reporte-Mensual-VicTec.pdf");
            headers.setContentLength(pdfBytes.length);

            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);

        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}