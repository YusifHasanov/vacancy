import {api} from "@/app/services/api";
import {CommonApiResponse} from "@/app/profile/cvmaker/types";

// Backend'deki ResumeCreateRequest DTO'suna karşılık gelir
export interface ResumeCreateRequest {
    templateId: string;
    data: string; // JSON verisi string olarak
}

// Backend'deki ResumeResponse DTO'suna karşılık gelir
export interface ResumeResponse {
    id: number; // veya Long/string, backend'deki tipe göre
    userId: string; // UUID string olarak
    templateId: string;
    data: string; // JSON string
    createdAt: string; // ISO 8601 formatında tarih string'i
    updatedAt: string;

}

const RESUME_TAG = 'Resume'; // Tekil bir CV için
const RESUME_LIST_TAG = 'ResumeList'; // CV listesi için

const resumeApiSlice = api.injectEndpoints({
    endpoints: (builder) => ({
        getAllResumes: builder.query<ResumeResponse[], void>({

            query: () => '/v1/resumes', // GET isteği yapılacak URL
            providesTags: [RESUME_LIST_TAG],
            transformResponse: (rawResponse: CommonApiResponse<ResumeResponse[]>) => {
                // Gelen zarfın içindeki 'data' dizisini ayıklayıp döndürüyoruz.
                return rawResponse.data;
            },
        }),

        getResumeById: builder.query<ResumeResponse, number>({ // ID'nin number olduğunu varsayıyoruz
            query: (id) => `/v1/resumes/${id}`, // ID'yi URL'e ekliyoruz
            providesTags: (result, error, id) => [{type: RESUME_TAG, id}],
        }),

        upsertResume: builder.mutation<ResumeResponse, ResumeCreateRequest>({
            query: (resumeData) => ({
                url: '/v1/resumes',
                method: 'POST',
                body: resumeData,
            }),
            invalidatesTags: [RESUME_LIST_TAG],
        }),

        deleteResume: builder.mutation<void, number>({
            query: (id) => ({
                url: `/v1/resumes/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [RESUME_LIST_TAG, {type: RESUME_TAG, id}],
        }),

    }),
});


export const {
    useGetAllResumesQuery,
    useGetResumeByIdQuery,
    useUpsertResumeMutation,
    useDeleteResumeMutation,
} = resumeApiSlice;
