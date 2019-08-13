function writeSuccess(el) {
  $('#postQuestionSuccess').append($(`<p>${JSON.stringify(el.question)}</p>`));
}

function writeError(obj) {
  $('#postQuestionError').removeClass('d-none');
  const message = obj.msg ? obj.msg : obj;
  $('#postQuestionError').append($(`<p>${message}</p>`));
}

function formatAnswers() {
  const answers = [];

  $('#answers')
    .find('.answer')
    .each(i => {
      answers.push({
        answer: $('#answers').find('.answer')[i].value,
        correct: $('#answers').find('.answer')[i].value === $('#correctAnswer').val(),
        explanation: $('#answersResponses').find('textarea')[i].value
      });
    });
  return answers;
}

function formatQuestion() {
  const answers = formatAnswers();
  const question = {
    question: $('#mcqQuestion').val(),
    category: $('#mcqCategory').val(),
    author: 'TODO: insert real author',
    answers
  };

  return question;
}

async function saveQuestion() {
  try {
    const question = formatQuestion();

    const promise = await fetch('http://api.articl.net/api/v1/questions', {
      method: 'POST', // or 'PUT'
      mode: 'cors',
      body: JSON.stringify(question), // data can be `string` or {object}!
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const result = await promise.json();
    console.log(result);

    if (result.error && result.error.message instanceof Array) {
      result.error.message.forEach(writeError);
    } else if (result.error && result.error.message) {
      writeError(result.error.message);
    } else if (result.error && result.error.errmsg) {
      writeError(result.error.errmsg);
    } else if (result.name === 'DatabaseError') {
      writeError(result.message);
    } else if (result.name) {
      writeError(result.message);
    } else {
      $('#postQuestionSuccess').removeClass('d-none');
      writeSuccess(result);
    }
  } catch (error) {
    // const message = await error.json();
    if (error.message) {
      writeError(error.message);
    }
  }
}

export { saveQuestion as default };
