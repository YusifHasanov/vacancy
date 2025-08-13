import ResumeBuilder from "./resume-builder"

const CvMaker = () => {
    return (
        <main className=" bg-gray-100 dark:bg-gray-900 py-8">
            <div className="container mx-auto h-screen">
                <ResumeBuilder />
            </div>
        </main>
    )
}

export default CvMaker;
