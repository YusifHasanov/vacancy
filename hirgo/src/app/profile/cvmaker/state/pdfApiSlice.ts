import {api} from "@/app/services/api";

interface GeneratePdfRequest {
    html: string;
}

const pdfApiSlice = api.injectEndpoints({
    endpoints: (builder) => ({
        generatePdf: builder.mutation<Blob, GeneratePdfRequest>({
            query: (args) => ({
                url: '/v1/generate-pdf',
                method: 'POST',
                body: args,

                // DÜZELTME BURADA: Cevabın nasıl işleneceğini belirtiyoruz.
                // Varsayılan 'json' yerine, cevabı 'blob' olarak işlemesini söylüyoruz.
                // Alternatif olarak 'text' de kullanabilirsiniz.
                responseHandler: (response) => response.blob(),

                // Header'ları manuel olarak da ayarlayabilirsiniz, ancak bu genellikle
                // responseHandler ile birlikte gereksizdir.
                // headers: {
                //   'Accept': 'application/pdf',
                // },
            }),
            // Başarılı bir şekilde blob döndüğünde, RTK Query artık parsing hatası vermez.
        }),
    }),
});

export const {useGeneratePdfMutation} = pdfApiSlice;
