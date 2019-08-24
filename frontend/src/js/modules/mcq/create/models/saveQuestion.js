function writeSuccess(obj) {
  $('#submitButton').addClass('d-none');
  $('#postQuestionSuccess').removeClass('d-none');
  const questionPreview = $('<div/>').append($('<p/>', { text: obj.question.question }));
  const answersPreview = $('<ul/>');
  const correct = $('<i/>', { class: 'fa fa-check-circle text-success' });
  const incorrect = $('<i/>', { class: 'fa fa-times-circle text-danger' });
  function addAnswer(answer) {
    const text = $('<p/>', { text: answer.answer });
    const glyph = answer.correct ? correct : incorrect;
    glyph.appendTo(text);
    const explanation = $('<p/>', { text: answer.explanation });
    const wholeAnswer = $('<li/>')
      .append(text)
      .append(explanation);
    wholeAnswer.appendTo(answersPreview);
  }
  obj.question.answers.forEach(addAnswer);
  questionPreview.append(answersPreview);
  $('#postQuestionSuccess').append(questionPreview);
  $('#postQuestionSuccess').append($(`<p>${JSON.stringify(obj)}</p>`));
}

function writeError(obj) {
  $('#postQuestionError').removeClass('d-none');
  const message = obj.msg ? obj.msg : obj;
  $('#postQuestionError').append($(`<p>${message}</p>`));
}

function resetSubmitButton() {
  $('#submitButton').prop('disabled', false);
  $('#submitButton')
    .find('.spinner')
    .addClass('d-none');
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
  writeSuccess(result);
}

function handleError(result) {
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
    writeError(result);
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
      success(data, statusText) {
        resetSubmitButton();
        if (statusText === 'success') {
          console.log('success', data);
          handleSuccess(data);
        } else {
          console.log('statusText', statusText);
          handleError(data.responseJSON || data);
        }
      },
      error(error) {
        resetSubmitButton();
        handleError(error.responseJSON || error);
      }
    });
  } catch (error) {
    resetSubmitButton();
    writeError(error);
  }
}

export { saveQuestion as default };
