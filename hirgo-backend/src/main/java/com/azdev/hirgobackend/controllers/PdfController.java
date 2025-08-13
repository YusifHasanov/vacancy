package com.azdev.hirgobackend.controllers;

import com.azdev.hirgobackend.dtos.resume.PdfGenerateRequest;
import com.azdev.hirgobackend.services.concretes.PdfGenerationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/generate-pdf")
@RequiredArgsConstructor
public class PdfController {

    private final PdfGenerationService pdfGenerationService;

    @PostMapping
    public ResponseEntity<byte[]> generatePdf(@Valid @RequestBody PdfGenerateRequest request) {
        try {
            // 1. Servisi kullanarak HTML'den PDF byte dizisi oluştur
            byte[] pdfBytes = pdfGenerationService.generatePdfFromHtml(request.getHtml());

            // 2. HTTP başlıklarını (headers) ayarla
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            // Bu başlık, tarayıcının dosyayı doğrudan göstermek yerine indirmesini sağlar
            headers.setContentDispositionFormData("attachment", "resume.pdf");
            headers.setContentLength(pdfBytes.length);

            // 3. PDF byte dizisini ve başlıkları içeren bir ResponseEntity döndür
            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);

        } catch (IOException e) {
            // Hata durumunda loglama yapabilir ve 500 Internal Server Error dönebilirsiniz
            // log.error("Error creating PDF: {}", e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}