"use client";

import React from 'react';
import { useResumeStore } from "@/store/resumestore";
import ResumeUI1 from "@/app/profile/cvmaker/previews/resume-ui-1";
import ResumeUI2 from "@/app/profile/cvmaker/previews/resume-ui-2";
import ResumeUI3 from "@/app/profile/cvmaker/previews/resume-ui-3";
import { Skeleton } from '@/components/ui/skeleton';
import ResumeUI4 from "@/app/profile/cvmaker/previews/resume-ui-4";
import ResumeUI5 from "@/app/profile/cvmaker/previews/resume-ui-5"; // Yükleme iskeleti için

interface ResumePreviewProps {
    isLoading: boolean;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ isLoading }) => {
    const { uiType } = useResumeStore();

    // Veri yüklenirken veya henüz gelmemişken bir iskelet göster
    if (isLoading) {
        return (
            <div className="p-8 space-y-6">
                <div className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                    </div>
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </div>
        );
    }

    // Yüklendikten sonra doğru şablonu göster
    switch (uiType) {
        case 'ui1': return <ResumeUI1 />;
        case 'ui2': return <ResumeUI2 />;
        case 'ui3': return <ResumeUI3 />;
        case 'ui4': return <ResumeUI4 />;
        case 'ui5': return <ResumeUI5 />;
        default: return <ResumeUI1 />;
    }
};

export default ResumePreview;
