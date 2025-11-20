package ViDev.Victec.Controller;

import ViDev.Victec.model.EstadoPedido;
import ViDev.Victec.model.Pedido;
import ViDev.Victec.model.PedidoItem;
import ViDev.Victec.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin/reportes")
public class ReportesController {

    @Autowired
    private PedidoRepository pedidoRepository;

    @GetMapping("/pdf/mensual")
    public ResponseEntity<byte[]> generarPdfMensual() {
        try {
            // 1. Definir el rango de fechas (Mes actual completo)
            LocalDateTime inicioMes = LocalDate.now().withDayOfMonth(1).atStartOfDay();
            LocalDateTime finMes = LocalDate.now().withDayOfMonth(LocalDate.now().lengthOfMonth()).atTime(23, 59, 59);
            String nombreMes = LocalDate.now().format(DateTimeFormatter.ofPattern("MMMM, yyyy"));

            // 2. Obtener pedidos REALES de la BD
            List<Pedido> todosLosPedidos = pedidoRepository.findAll();

            // 3. Filtrar: Solo pedidos de este mes y que NO estén cancelados o pendientes (solo ventas reales)
            List<Pedido> ventasDelMes = todosLosPedidos.stream()
                    .filter(p -> p.getFechaPedido().isAfter(inicioMes) && p.getFechaPedido().isBefore(finMes))
                    .filter(p -> p.getEstado() != EstadoPedido.CANCELADO && p.getEstado() != EstadoPedido.PENDIENTE)
                    .collect(Collectors.toList());

            // --- Inicio Creación PDF ---
            Document document = new Document();
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            PdfWriter.getInstance(document, out);
            document.open();

            // Estilos de Fuente
            Font fontTitulo = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, Color.DARK_GRAY);
            Font fontSubtitulo = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, Color.BLACK);
            Font fontNormal = FontFactory.getFont(FontFactory.HELVETICA, 12, Color.BLACK);
            Font fontError = FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 12, Color.RED);

            // Título del Documento
            Paragraph titulo = new Paragraph("Reporte Mensual de Ventas - VicTec", fontTitulo);
            titulo.setAlignment(Element.ALIGN_CENTER);
            document.add(titulo);
            document.add(new Paragraph(" ")); // Espacio vacío

            // Información General
            document.add(new Paragraph("Período: " + nombreMes, fontNormal));
            document.add(new Paragraph("Fecha de emisión: " + LocalDate.now(), fontNormal));
            document.add(new Paragraph("-----------------------------------------------------------------"));
            document.add(new Paragraph(" "));

            // 4. Lógica: ¿Hay ventas o no?
            if (ventasDelMes.isEmpty()) {
                // CASO A: No hay ventas
                Paragraph aviso = new Paragraph("Aún no se ha vendido ningún producto este mes.", fontError);
                aviso.setAlignment(Element.ALIGN_CENTER);
                document.add(aviso);
                
                document.add(new Paragraph(" "));
                document.add(new Paragraph("Total Ganancias: CLP$ 0", fontSubtitulo));

            } else {
                // CASO B: ¡Sí hay ventas!
                
                // 4.1 Calcular Total Ganado
                BigDecimal totalGanancias = ventasDelMes.stream()
                        .map(Pedido::getTotal)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);

                document.add(new Paragraph("Resumen Financiero:", fontSubtitulo));
                document.add(new Paragraph("Cantidad de Pedidos: " + ventasDelMes.size(), fontNormal));
                document.add(new Paragraph("Total Ganancias: CLP$ " + totalGanancias.intValue(), fontSubtitulo));
                document.add(new Paragraph(" "));

                // 4.2 Agrupar productos vendidos (Nombre -> Cantidad Total)
                Map<String, Integer> conteoProductos = new HashMap<>();
                
                for (Pedido pedido : ventasDelMes) {
                    if (pedido.getItems() != null) {
                        for (PedidoItem item : pedido.getItems()) {
                            String nombreProd = item.getProducto().getNombre();
                            int cantidad = item.getCantidad();
                            conteoProductos.put(nombreProd, conteoProductos.getOrDefault(nombreProd, 0) + cantidad);
                        }
                    }
                }

                // 4.3 Crear Tabla de Productos Vendidos
                document.add(new Paragraph("Detalle de Productos Vendidos:", fontSubtitulo));
                document.add(new Paragraph(" "));

                PdfPTable table = new PdfPTable(2); // 2 Columnas
                table.setWidthPercentage(100);
                table.setSpacingBefore(10f);
                
                // Encabezados de Tabla
                PdfPCell celdaProducto = new PdfPCell(new Phrase("Producto", fontSubtitulo));
                celdaProducto.setBackgroundColor(Color.LIGHT_GRAY);
                celdaProducto.setPadding(5);
                table.addCell(celdaProducto);

                PdfPCell celdaCantidad = new PdfPCell(new Phrase("Unidades Vendidas", fontSubtitulo));
                celdaCantidad.setBackgroundColor(Color.LIGHT_GRAY);
                celdaCantidad.setPadding(5);
                table.addCell(celdaCantidad);

                // Llenar la tabla con los datos reales
                for (Map.Entry<String, Integer> entrada : conteoProductos.entrySet()) {
                    table.addCell(new Phrase(entrada.getKey(), fontNormal));
                    table.addCell(new Phrase(entrada.getValue().toString(), fontNormal));
                }

                document.add(table);
            }

            document.add(new Paragraph(" "));
            document.add(new Paragraph("Fin del reporte.", FontFactory.getFont(FontFactory.HELVETICA, 10, Color.GRAY)));

            document.close();
            // --- Fin Creación PDF ---

            byte[] pdfBytes = out.toByteArray();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "Reporte-Ventas-" + LocalDate.now() + ".pdf");
            headers.setContentLength(pdfBytes.length);

            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);

        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}