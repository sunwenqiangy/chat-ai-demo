import { Configuration, OpenAIApi } from 'openai'




export default async function (req, res) {
  // if (!configuration.apiKey) {
  //   res.status(500).json({
  //     error: {
  //       message: "OpenAI API key not configured, please follow instructions in README.md",
  //     }
  //   });
  //   return;
  // }

  console.log('req', req);

  const configuration = new Configuration({
    apiKey: req.apiKey,
  });
  const openai = new OpenAIApi(configuration);

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: req.messages,
      max_tokens: 100,
    });
    res.status(200).json({ result: completion.data.choices[0] });
  } catch(error) {
    if (error.response) {
      console.log(1);
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.log(2);
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}
