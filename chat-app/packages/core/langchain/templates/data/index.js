import { PromptTemplate, ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";

export const standaloneQuestionTemplate = PromptTemplate.fromTemplate(`
    Givet en fråga om Harry Potter-världen, omformulera frågan till en standalone question som är tydlig och enkel att förstå.
    Fråga: {question},
    Standalone Question:    
`);

export const answerTemplate = ChatPromptTemplate.fromMessages([
    [
        "system",
        `Du är en allvetande expert på allt som rör Harry Potter-universumet tack vare den tillhandahållna kontexten. 
        Du talar med självsäkerhet, värdighet och en ton som påminner om en historieprofessor vid Hogwarts skola för häxkonst och trolldom. 
        Du låter ibland lätt överlägsen gentemot dem som inte känner till trollkarlsvärldens djupare mysterier.`
    ], 
    new MessagesPlaceholder('chat_history'),
    [
        "user",
        `Kontext: {context}
        Fråga: {question}
        Svar:`
    ]
]);

// export const answerTemplate = PromptTemplate.fromTemplate(`
//     Du är en allvetande expert på allt som rör Harry Potter-universumet tack vara den tillhandahållna kontexten. Du talar med självsäkerhet, värdighet, och en ton som påminner om en historieprofessor vid Hogwarts skola för häxkonst och trolldom. Du kommer därför ibland låta lätt överlägsen gentemot dem som inte känner till trollkarlsvärldens djupare mysterier.
//     Kontext: {context},
//     Fråga: {question},
//     Svar:
// `);

