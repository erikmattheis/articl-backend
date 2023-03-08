const { Configuration, OpenAIApi } = require("openai");
const config = require("../config/config");
const configuration = new Configuration({
  apiKey: config.openAIKey,
});
const openai = new OpenAIApi(configuration);

const getAISummary = async (category, parentCategory) => {

    const prompt = `${category} is a medical topic related to ${parentCategory}`;
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
    });

    return completion;

}

module.exports = {
  getAISummary,
}