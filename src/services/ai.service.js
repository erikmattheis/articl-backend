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

    return completion;

}

module.exports = {
  getAISummary,
}