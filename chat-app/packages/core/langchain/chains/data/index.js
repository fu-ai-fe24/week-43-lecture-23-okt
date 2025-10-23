import { RunnableSequence, RunnablePassthrough } from '@langchain/core/runnables';
import { retriever } from '@chatapp/retriever';
import { standaloneQuestionTemplate, answerTemplate } from '@chatapp/templates';
import { combineDocuments } from '@chatapp/combinedocuments';
import { llm } from '@chatapp/llm';
import { StringOutputParser } from '@langchain/core/output_parsers';

// 1. Konvertera frpgan till en standalone question
const standaloneQuestionChain = RunnableSequence.from([
    standaloneQuestionTemplate,
    llm,
    new StringOutputParser()
]);

// 2. Använda standalone question för att söka kontext från databasen
const retrieverChain = RunnableSequence.from([
    (data) => {
        return data.standaloneQuestion
    },
    retriever,
    combineDocuments
]);


// 3. Använda kontexten och den ursprungliga frågan för att fråga språkmodellen
const answerChain = RunnableSequence.from([
    answerTemplate,
    llm,
    new StringOutputParser()
]);

export const chain = RunnableSequence.from([
    {
        standaloneQuestion : standaloneQuestionChain,
        originalQuestion : new RunnablePassthrough()
    },
    {
        context : retrieverChain,
        question : ({ originalQuestion }) => originalQuestion.question
    },
    answerChain
]);