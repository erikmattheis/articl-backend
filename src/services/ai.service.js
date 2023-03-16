const { Configuration, OpenAIApi } = require("openai");
const config = require("../config/config");
const configuration = new Configuration({
  apiKey: config.openAIKey,
});
const openai = new OpenAIApi(configuration);

const getAISummary = async (category, parentCategory) => {
  try {
    const prompt = `${category} is a medical topic related to ${parentCategory}`;
    const message = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
    });
    return {
      status: 200,
      message
    }
  }
  catch (err) {
    return {
      status: err.response?.status,
      message: 'The AI service returned an error code of ' + err.response?.status + ' and the message ' + err.message
    }
  }
}

module.exports = {
  getAISummary,
}