function writeSuccess(el) {
  $('#postQuestionError').removeClass('d-none');
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
        answer: $('#answers')
          .find('.answer')
          [i].value.trim(),
        correct:
          $('#answers')
            .find('.answer')
            [i].value.trim() ===
          $('#correctAnswer')
            .val()
            .trim(),
        explanation: $('#answerExplanations')
          .find('textarea')
          [i].value.trim()
      });
    });
  return answers;
}

function formatQuestion() {
  const answers = formatAnswers();
  const question = {
    question: $('#mcqQuestion')
      .val()
      .trim(),
    category: $('#mcqCategory')
      .val()
      .trim(),
    author: 'TODO: insert real author',
    answers
  };

  return question;
}

function handleSuccess(result) {
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
}

async function saveQuestion() {
  $('#postQuestionError')
    .addClass('d-none')
    .empty();
  $('#postQuestionSuccess')
    .addClass('d-none')
    .empty();
  try {
    const question = formatQuestion();
    $.ajax({
      type: 'POST',
      url: 'https://api.articl.net/api/v1/questions',
      dataType: 'json',
      cache: false,
      data: JSON.stringify(question),
      contentType: 'application/json',
      timeout: 5000,
      success(data) {
        handleSuccess(data.responseJSON);
      },
      error(error) {
        handleSuccess(error.responseJSON);
      }
    });
  } catch (error) {
    writeError(error);
  }
}

export { saveQuestion as default };
