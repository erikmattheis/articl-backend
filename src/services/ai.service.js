const { Configuration, OpenAIApi } = require("openai");
const config = require("../config/config");
const configuration = new Configuration({
  apiKey: config.openAIKey,
});
const openai = new OpenAIApi(configuration);

const getAISummary = async (prompt) => {
  
    const completion = await openai.createCompletion({
      model: "text-davinci-002",
      prompt,
    });

    console.log('completion', completion);
    return completion.data.choices[0].text;

}

module.exports = {
  getAISummary,
}