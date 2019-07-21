const mongodb = require('../mongoDBFunction');
const validate = require('../validate');

async function postQuestion(req, res, next) {
  console.log('posting question');
  let validationResult;
  let insertionResult;
  try {
    validationResult = await validate.postQuestion(req, res, next);
    // console.log('validationResult', validationResult);
    if (validationResult instanceof ValididAtionError) {
      router.use((err, req, res, next) => {
        if (!error.statusCode) {
          error.statusCode = 500;
        }
        res.status(err.statusCode).send({ errors: error });
        next();
      });

      console.log('validationResultError in router', JSON.stringify(validationResult));
      return validationResult;

      // res.status(422).json({ errors: validationResult });
    }
    // const sanitizationPassed = await sanitize.postQuestion(req, res);

    insertionResult = await mongodb.insertQuestion(req, res, next);
    if (insertionResult instanceof Error) {
      console.log('insertionResult Error in router', insertionResult);
      return insertionResult;
    }
    console.log('insertionResult', insertionResult);
    return res.status(201).json({ success: 'success', result: insertionResult });
  } catch (error) {
    console.log('catch in router', error);
    return error;
  }
}
exports.postQuestion = postQuestion;
