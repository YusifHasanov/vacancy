"use client";

import React, {useState} from 'react';
import {Download, LayoutTemplate, Save} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useResumeStore} from "@/store/resumestore";
import {useUpsertResumeMutation} from "@/app/profile/cvmaker/state/resumeApiSlice";
import {useGeneratePdfMutation} from "@/app/profile/cvmaker/state/pdfApiSlice";
import TemplateSelectionModal from "@/app/profile/cvmaker/TemplateSelectionModal";
import {UiType} from "@/app/profile/cvmaker/types"; // Button component'ini import edin


const ResumeToolbar: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Zustand store'undan verileri alıyoruz
    const {resumeData, uiType, setUiType} = useResumeStore();

    // RTK Query hook'larından yükleme durumlarını da alıyoruz
    const [generatePdf, {isLoading: isDownloading}] = useGeneratePdfMutation();
    const [upsertResume, {isLoading: isSaving}] = useUpsertResumeMutation();

    const handleDownload = async () => {
        const previewElement = document.getElementById("cv-preview");
        if (!previewElement) {
            console.error("Preview element not found.");
            return;
        }
        const resumeHtml = previewElement.innerHTML;
        const fullHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Resume</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          html, body {
            margin: 0;
            padding: 0;
            /* Arka planın tutarlı olduğundan emin ol */
            background-color: white; 
          }
          body {
            width: 210mm;
            height: 297mm; /* Body'e sabit A4 yüksekliği veriyoruz */
            
            /* DÜZELTME: Body'nin kendisini flex container yapıyoruz */
            display: flex;
            flex-direction: column; /* İçeriğin dikey olarak dizilmesini sağlar */
            
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
            box-sizing: border-box;
          }
          /* .resume-wrapper artık gerekli değil, doğrudan 
             özgeçmişin kendi div'ini hedefleyeceğiz. */
        </style>
      </head>
      <body>
        ${resumeHtml}
      </body>
      </html>
    `;


        try {
            console.info("Generating your PDF...");
            const pdfBlob = await generatePdf({html: fullHtml}).unwrap();

            const url = window.URL.createObjectURL(pdfBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'resume.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            console.log("PDF downloaded successfully!");
        } catch (err) {
            console.error('Failed to generate PDF:', err);
        }

     await handleSaveResume()
    };

    const handleSaveResume = async () => {
        try {
            const requestBody = {
                templateId: uiType,
                data: JSON.stringify(resumeData),
            };
            await upsertResume(requestBody).unwrap();
            console.log("Resume saved successfully!");
        } catch (err) {
            console.error('Failed to save resume:', err);
        }
    };


    const handleTemplateSelect = (uiType: UiType) => {
        setUiType(uiType);
        setIsModalOpen(false);
    };

    return (
        <div className="flex flex-wrap gap-4 mb-4">
            <Button
                onClick={handleSaveResume}
                disabled={isSaving}
                className="inline-flex items-center gap-2"
            >
                <Save className="w-4 h-4"/>
                {isSaving ? 'Saving...' : 'Save'}
            </Button>

            <Button
                onClick={() => {
                    setIsModalOpen(true)
                }}
                variant="outline"
                className="inline-flex items-center gap-2"
            >
                <LayoutTemplate className="w-4 h-4"/>
                Change Template
            </Button>

            <Button
                onClick={handleDownload}
                disabled={isDownloading}
                variant="outline"
                className="inline-flex items-center gap-2"
            >
                <Download className="w-4 h-4"/>
                {isDownloading ? 'Downloading...' : 'Download'}
            </Button>


            <TemplateSelectionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSelect={handleTemplateSelect}
            />
        </div>
    );
};

export default ResumeToolbar;
