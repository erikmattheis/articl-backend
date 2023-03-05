const { Configuration, OpenAIApi } = require("openai");
const config = require("../config/config");

const configuration = new Configuration({
  apiKey: config.openAIKey,
});
const openai = new OpenAIApi(configuration);

const getAISummary = async (prompt) => {
  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
    });

    console.log('completion', completion);
    return completion.data.choices[0].text;
    //res.send(completion.data.choices[0].text);
  }
  catch (err) {
    console.log(err.message);
  }

}

module.exports = {
  getAISummary,
}