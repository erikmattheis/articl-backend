const { Configuration, OpenAIApi } = require("openai");
const config = require("../config/config");
const configuration = new Configuration({
  apiKey: config.openAIKey,
});
const openai = new OpenAIApi(configuration);

const getAISummary = async (category, parentCategory) => {
    
    try {
      const prompt = `${category} is a medical topic related to ${parentCategory}`;
      const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt,
      });
  
    }
    catch (err) {
      return 'The AI service returned an error code of ' + err.response?.status + ' and the message ' + err.message;
    }

    return completion;

}

module.exports = {
  getAISummary,
}