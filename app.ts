
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

const promptOptions = {
	purpose: 'No specific purpose',
	city: 'Suggest me a city',
	days: 4,
	participant: '',
	existingPlan: [
		{
			day: 2,
			activities: ['Visit a friend', 'Eat local foods'],
		},
		{
			day: 3,
			activities: ['Visit a relative grave'],
		},
	],
	timeAvailablePerDay: [
		{
			day: 2,
			start: '09:00',
			finish: '20:00',
		},
	],
	budget: '',
	budgetCurrency: 'USD',
	preferedActivities: [],
	showEstimatedTimeline: 'Yes',
	showEstimatedCost: 'Yes',
	showReasonOfActivities: 'Yes',
	showImageIfAvailable: 'No',
};

const {purpose, city, days, showEstimatedTimeline, showEstimatedCost, showReasonOfActivities, showImageIfAvailable} = promptOptions;
const participant = promptOptions.participant ?? 'No specific participant';
const existingPlan = promptOptions.existingPlan.length > 0 ? promptOptions.existingPlan.map(plan => `Day ${plan.day}: ${plan.activities.join(', ')}`).join('\n') : 'No existing plan';
const timeAvailablePerDay = promptOptions.timeAvailablePerDay.length > 0 ? promptOptions.timeAvailablePerDay.map(time => `Day ${time.day}: start: ${time.start}, finish: ${time.finish}`).join('\n') : 'No specific time';
const budgetCurrency = promptOptions.budgetCurrency ?? 'USD';
const budget = promptOptions.budget ?? 'No specific budget';
const preferedActivities = promptOptions.preferedActivities.length > 0 ? promptOptions.preferedActivities.join(', ') : 'No specific activities';

console.log(timeAvailablePerDay);

const prompt = `
You are acting as a travel guide AI, you will give me an itinerary of the trip as well as per the details specified by the user.
Don't add opening and closing sentences. Just show me the itinerary.
Show me the result in the following JSON format: 
{
	itinerary: {
    city: string,
    duration: integer,
    budgetPerDay: integer,
    totalBudget: integer,
    plans: [
      {
        day: integer,
        activities: [
          {
            name: string,
            reason: string,
            cost: integer,
            estimatedStartTime: string,
            estimatedEndTime: string,
          }
        ],
      },
    ],
  },
}

Write me an itinerary for a trip with the following details:
- Purpose: ${purpose}
- City: ${city}
- Days: ${days}
- Participant: ${participant}
- Existing plan: ${existingPlan}
- Time available per day (if not specified, then available all day): ${timeAvailablePerDay}
- Currency: ${budgetCurrency}
- Budget per day: ${budget}
- Prefered activities: ${preferedActivities}
- Show estimated timeline: ${showEstimatedTimeline}
- Show estimated cost: ${showEstimatedCost}
- Show the reason for choosing the activities: ${showReasonOfActivities}
- Show image (if available): ${showImageIfAvailable}
`;

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
