const { Configuration, OpenAIApi } = require("openai");
const config = require("../config/config");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY || config.openAIKey,
});
const openai = new OpenAIApi(configuration);
const API_KEY = "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";

const model = "gpt-3.5-turbo";
const temp = 0.5;
const tokens = 400;
const getAISummary = async (category, parentCategory) => {
  try {
      const completion = await openai.createChatCompletion({
        model: model,
        messages: [
        { role: "system", content: "You are web copywriter" },
        { role: "user", content: `definition of ${category}` },
        ],
        temperature: temp,
        max_tokens: tokens,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        n: 2,
        stop: "",
      });
      const response = completion.data.choices;
      
      // Show the response
      console.log("==++==++==++==++==++====++==++==++==++==++==");
      console.log(response);
      console.log("==++==++==++==++==++====++==++==++==++==++==");
      
      /*
      prompt: [{
        role: "system",
        content: "Web copywriter",
      },
      {
        role: "user",
        content: `Above-the-fold text for medical pros and meta description for topic ${category})`,
      }]
      */
    

   

const result = JSON.stringify(response);

console.log('result:', result);

    return {
      status: 200,
      message: result
    }

  }
  catch (err) {
    console.log('err:', err);
    return {

      status: err.response?.status,
      message: 'The AI service returned an error code of ' + err.response?.status + ' and the message ' + err ,
    }
  }
}


setTimeout(async function() {
  const f = await getAISummary('covid-19', 'infectuous disease');
  //console.log('f:', f);
}, 1000);


module.exports = {
  getAISummary,
}
