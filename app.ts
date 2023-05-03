
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
require('dotenv').config();

import {Configuration, OpenAIApi} from 'openai';

const organization = process.env.OPENAI_ORGANIZATION ?? 'organization';
const openApiKey = process.env.OPENAI_API_KEY ?? 'apiKey';

const configuration = new Configuration({
	organization,
	apiKey: openApiKey,
});

const openai = new OpenAIApi(configuration);

const prompt = `You are a travel guide AI. 
Write me a 7 days itinerary for a trip on Tangerang.`;

const test = async () => {
	const response = await openai.createChatCompletion({
		model: 'gpt-3.5-turbo',
		messages: [
			{
				role: 'user',
				content: prompt,
			},
		],
		temperature: 0,
	});
	console.log(response.data);
	console.log(response.data.choices[0]);
};

void test();
