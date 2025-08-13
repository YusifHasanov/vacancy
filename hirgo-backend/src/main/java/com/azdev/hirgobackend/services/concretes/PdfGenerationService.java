package com.azdev.hirgobackend.services.concretes;

import com.microsoft.playwright.Browser;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.options.Margin;
import com.microsoft.playwright.options.Media;
import com.microsoft.playwright.options.WaitUntilState;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PdfGenerationService {

    private final Browser browser;

    private static final int A4_WIDTH_PX = 794;
    private static final int A4_HEIGHT_PX = 1123;

    public byte[] generatePdfFromHtml(String fullHtml) throws IOException {
        Page page = null;
        try {
            page = browser.newPage();
            page.setViewportSize(A4_WIDTH_PX, A4_HEIGHT_PX);
            page.setContent(fullHtml, new Page.SetContentOptions().setWaitUntil(WaitUntilState.NETWORKIDLE));
            page.emulateMedia(new Page.EmulateMediaOptions().setMedia(Media.PRINT));

            // DÜZELTME BURADA: PdfOptions nesnesini oluşturup ayarlıyoruz.
            Page.PdfOptions pdfOptions = new Page.PdfOptions();

            // Ayarları tek tek set edelim.
            pdfOptions.setFormat("A4");
            pdfOptions.setPrintBackground(true);

            // Margin nesnesini oluşturup pdfOptions'a set edelim.
            Margin margin = new Margin();
            margin.setTop("0mm");
            margin.setBottom("0mm");
            margin.setLeft("0mm");
            margin.setRight("0mm");

            pdfOptions.setMargin(margin);

            // Ayarlanmış options nesnesini pdf metoduna verelim.
            byte[] pdfBytes = page.pdf(pdfOptions);

            return pdfBytes;
        } catch (Exception e) {
            // log.error("PDF generation failed", e);
            throw new IOException("Failed to generate PDF from HTML", e);
        } finally {
            if (page != null) {
                page.close();
            }
        }
    }
}