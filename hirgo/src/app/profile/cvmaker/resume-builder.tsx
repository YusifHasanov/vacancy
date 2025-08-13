"use client";

import React from "react";
import ResumeForm from "./resume-form";
import ResumeContainer from "@/app/profile/cvmaker/resume-container";

const ResumeBuilder: React.FC = () => {
    return (
        <div className="flex flex-col md:flex-row gap-8 p-4 md:p-0 h-full">
            <div
                className="md:w-1/2 lg:w-2/5 h-full overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
                <ResumeForm/>
            </div>
            <div
                className="md:w-1/2 lg:w-3/5 h-full overflow-y-auto flex justify-center items-start p-4 bg-gray-200 dark:bg-gray-800 rounded-lg">
                <ResumeContainer/>
            </div>
        </div>
    );
};

export default ResumeBuilder;
