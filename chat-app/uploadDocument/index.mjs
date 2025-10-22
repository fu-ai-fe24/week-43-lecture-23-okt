import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OllamaEmbeddings } from "@langchain/ollama";
import { createClient } from '@supabase/supabase-js';
import { readFile } from 'fs/promises';
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import "dotenv/config";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

const combineDocuments = (docs) => {
    return docs.map(doc => doc.pageContent).join('\n\n');
}

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_API_KEY = process.env.SUPABASE_API_KEY;

const file = '';

try {
    // .pdf-fil
    // const loader = new PDFLoader(`${process.cwd()}/${filename}`);
    // const text = combineDocuments(await loader.load());

    // .txt-fil
    const text = await readFile(`${process.cwd()}/potterfull.txt`, "utf-8");
    
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize : 500,
        separators : ["\n\n", "\n", " ", ""],
        chunkOverlap : 100
    });

    const splittedText = await textSplitter.createDocuments([text]);
    
    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_API_KEY);

    await SupabaseVectorStore.fromDocuments(
        splittedText,
        new OllamaEmbeddings({
            model : "llama3.1:8b"
        }), {
            client : supabaseClient, 
            tableName : 'documents'
        }
    );

    console.log('SUCCESS');
    
} catch(error) {
    console.log('ERROR:', error.message);
    
}