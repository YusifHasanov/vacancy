import puppeteer from 'puppeteer';
import {NextRequest, NextResponse} from 'next/server';

export async function GET(): Promise<NextResponse> {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    const resumeUrl = 'http://localhost:3000/profile/cvmaker';

    await page.goto(resumeUrl, { waitUntil: 'networkidle0' });

    await page.waitForSelector('#cv-preview', { timeout: 5000 });

    await page.evaluate(() => {
        const target = document.getElementById('cv-preview');
        if (target) {
            document.body.innerHTML = '';
            document.body.appendChild(target);


            target.style.width = '794px';
            target.style.height = '1123px';
            target.style.maxWidth = 'none';
        }
    });

    const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '0mm', bottom: '0mm', left: '0mm', right: '0mm' },
    });

    await browser.close();

    return new NextResponse(pdfBuffer, {
        headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename="resume.pdf"',
        },
    });
}


export async function POST(req: NextRequest) {
    try {
        // 1. İstekten HTML'i al
        const { html } = await req.json();

        if (!html) {
            return new NextResponse('HTML content is missing', { status: 400 });
        }

        // 2. Puppeteer ile bir tarayıcı başlat
        // NOT: Vercel gibi serverless ortamlarda chrome-aws-lambda kullanmak daha iyi sonuç verir.
        // Lokal geliştirme için puppeteer yeterlidir.
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'] // Serverless ortamlar için önemli
        });
        const page = await browser.newPage();

        // 3. Sayfanın içeriğini gelen HTML olarak ayarla
        // ÖNEMLİ: Tailwind CSS'in çalışması için stilleri dahil etmemiz gerekir.
        // En basit yöntem, Tailwind'in CDN linkini HTML'e eklemektir.
        const fullHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <body>
                ${html}
            </body>
            </html>
        `;

        // Sayfanın içeriğini ayarla
        await page.setContent(fullHtml, { waitUntil: 'networkidle0' });

        // 4. PDF oluştur
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true, // Arka plan renkleri ve resimlerini de yazdırmak için
        });

        // 5. Tarayıcıyı kapat
        await browser.close();

        // 6. PDF'i istemciye geri gönder
        return new NextResponse(pdfBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="resume.pdf"',
            },
        });

    } catch (error) {
        console.error('Error generating PDF:', error);
        return new NextResponse('Failed to generate PDF', { status: 500 });
    }
}
