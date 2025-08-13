"use client";

import React, {useEffect, useState} from 'react';
import ResumeToolbar from "@/app/profile/cvmaker/resume-toolbar";
import {useGetAllResumesQuery} from "@/app/profile/cvmaker/state/resumeApiSlice";
import {useResumeStore} from "@/store/resumestore";
import {ResumeData, UiType} from "@/app/profile/cvmaker/types";
import ResumePreview from "@/app/profile/cvmaker/previews/ResumePreview";

const ResumeContainer: React.FC = () => {
    const {data: resumes, isSuccess, isLoading, isError} = useGetAllResumesQuery();
    const {setResumeData, setUiType} = useResumeStore();
    const [isStoreInitialized, setIsStoreInitialized] = useState(false);

    useEffect(() => {
        if (isSuccess && resumes && resumes.length > 0 && !isStoreInitialized) {
            console.log("Initializing global state from fetched resume data...");

            const latestResume = resumes[0];
            const resumeDataFromServer = JSON.parse(latestResume.data) as ResumeData;

            setResumeData(resumeDataFromServer);
            setUiType(latestResume.templateId as UiType);

            setIsStoreInitialized(true);
        }
        if (isSuccess && (!resumes || resumes.length === 0) && !isStoreInitialized) {
            setIsStoreInitialized(true);
        }
    }, [resumes, isSuccess, isStoreInitialized, setResumeData, setUiType]);

    return (


        <div className="relative">
            <ResumeToolbar/>

            <div
                id="cv-preview"
                className="w-full min-h-[1010px] bg-white dark:bg-gray-800 shadow-2xl aspect-[210/297] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 border border-gray-300 dark:border-gray-700 rounded-sm"
            >
                {isError && (
                    <div className="p-8 text-center text-red-500">
                        Failed to load resume data. Please refresh the page.
                    </div>
                )}

                {!isError && <ResumePreview isLoading={isLoading || !isStoreInitialized}/>}
            </div>
        </div>
    );


};

export default ResumeContainer;












