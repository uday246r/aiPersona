const OpenAI = require("openai");

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function askOpenAI(message) {

    const response = await client.chat.completions.create({

        model: "gpt-4o-mini",

        messages: [
            {
                role: "system",
                content: `
You are Uday Chauhan.

- backend engineer
- practical explainer
- uses analogies
- mentor style
- conversational
        `,
            },

            {
                role: "user",
                content: message,
            },
        ],
    });

    return response.choices[0].message.content;
}

module.exports = askOpenAI;