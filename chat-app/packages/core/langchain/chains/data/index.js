import { RunnableSequence, RunnablePassthrough } from '@langchain/core/runnables';
import { retriever } from '@chatapp/retriever';
import { standaloneQuestionTemplate, answerTemplate } from '@chatapp/templates';
import { combineDocuments } from '@chatapp/combinedocuments';
import { llm } from '@chatapp/llm';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { BufferMemory } from 'langchain/memory';
import { ConversationChain } from 'langchain/chains';

const memory = new BufferMemory({
    memoryKey : 'chat_history',
    returnMessages : true,
    inputKey : 'question'
});

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
// const answerChain = RunnableSequence.from([
    //     answerTemplate,
    //     llm,
    //     new StringOutputParser()
    // ]);

// 3. Använda kontexten och den ursprungliga frågan för att fråga språkmodellen
const conversationChain = new ConversationChain({
    llm,
    prompt : answerTemplate,
    memory
});

export const chain = RunnableSequence.from([
    {
        standaloneQuestion : standaloneQuestionChain,
        originalQuestion : new RunnablePassthrough()
    },
    {
        context : retrieverChain,
        question : ({ originalQuestion }) => originalQuestion.question
    },
    conversationChain
]);










// Denna delen av koden är enbart ett exempel och fungerar inte
const answer = await chain.invoke({question : 'Vem är Harry Potter?'});

const chain = RunnableSequence.from([
    // 1. Konvertera användarens fråga till en standalone question
    async ({question}) => {
        const standaloneQuestion = await llm.invoke(
            await standaloneQuestionTemplate.format({ question })
        )
        console.log(standaloneQuestion);
        
        return { standaloneQuestion, question }
    },
    // 2. Använda standalone question för att söka i databasen, och konvertera till en kontextsträng
    async ({ standaloneQuestion, question }) => {
        const data = retriever.invoke(standaloneQuestion);
        const context = combineDocuments(data);
        return { context, question  }
    },
    // 3. Skicka orginalfråga(fråga och användarens kontext) OCH kontext(från databasen) till din llm
    async ({ context, question }) => {
        const finalAnswer = await llm.invoke(
            await answerTemplate.format({ constext : context, question : question })
        )
        return finalAnswer;
    }
]);