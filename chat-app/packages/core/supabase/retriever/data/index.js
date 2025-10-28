import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OllamaEmbeddings } from "@langchain/ollama";
import { client } from '@chatapp/client';

const embeddings = new OllamaEmbeddings({
    model : 'llama3.2:latest'
});

const vectorStore = new SupabaseVectorStore(
    embeddings,
    {
        client : client,
        tableName : 'documents',
        queryName : 'match_documents'
    }
);

export const retriever = vectorStore.asRetriever();