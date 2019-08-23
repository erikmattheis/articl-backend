function writeSuccess(obj) {
  console.log('writeSuccess', obj);
  $('#postQuestionSuccess').removeClass('d-none');
  const questionPreview = $('<div/>').append($('<p/>', { text: obj.question.question }));
  const answersPreview = $('<ul/>');
  const correct = $('<i/>', { class: 'fa fa-check-circle text-success' });
  const incorrect = $('<i/>', { class: 'fa fa-times-circle text-danger' });
  function addAnswer(answer, i) {
    console.log('i', i);
    const text = $('<p/>', { text: answer.answer });
    const glyph = answer.correct ? correct : incorrect;
    glyph.appendTo(text);
    const explanation = $('<p/>', { text: answer.explanation });
    const wholeAnswer = $('<li/>')
      .append(text)
      .append(explanation);
    wholeAnswer.appendTo(answersPreview);
    /*
      .append(text)
      .append(glyph)
      .append(explanation);
      */
  }
  obj.question.answers.forEach(addAnswer);
  questionPreview.append(answersPreview);
  $('#postQuestionSuccess').append(questionPreview);
  /*
  {"question":
  {"_id":"5d5e2ebeab29b000178b5303",
  "answers":[
    {"_id":"5d5e2ebeab29b000178b5305",
    "answer":"This is answer 1",
    "correct":true,
    "explanation":"This is explanation response00"
    },
    {"_id":"5d5e2ebeab29b000178b5304",
    "answer":"This is answer 2",
    "correct":false,
    "explanation":"This is explanation response11"}
    ],"author":"TODO: insert real author",
    "category":[
      {"_id":"5d5e2ebeab29b000178b5306",
      "category_image":"",
      "description":"desc",
      "parent":0,
      "term_id":1,
      "title":"My Title"}
      ],"createTime":"2019-08-22T05:57:18.957Z",
      "question":"This is the first question",
      "updated":"2019-08-22T05:57:18.957Z",
      "__v":0},
      "success":"success"}
      */
  $('#postQuestionSuccess').append($(`<p>${JSON.stringify(obj)}</p>`));
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
        console.log('statusText', statusText);
        if (statusText === 'success') {
          console.log('success', data);
          handleSuccess(data);
        } else {
          console.log('statusText', statusText);
          handleError(data.responseJSON || data);
        }
      },
      error(error) {
        console.log('errorHandler', error);
        handleError(error.responseJSON || error);
      }
    });
  } catch (error) {
    writeError(error);
  }
}

export { saveQuestion as default };
