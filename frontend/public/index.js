(function () {
  'use strict';

  let categoryNames;

  async function getAPICategoryNames() {
    return $.ajax({
      type: 'GET',
      // url: 'https://immense-plains-76913.herokuapp.com/api/v1/categories',
      url: 'http://localhost:3000/api/v1/categories',
      dataType: 'json',
      timeout: 5000,
      success(data) {
        categoryNames = data;
        return data;
      },
      failure(error) {
        throw new Error(`Getting categories failed! The server said: ${error}`);
      }
    });
  }
  async function getCategoryNames() {
    try {
      if (categoryNames) {
        return categoryNames;
      }
      const result = await getAPICategoryNames();
      return result;
    } catch (error) {
      throw error;
    }
  }

  async function init() {
    try {
      console.log('getting category names');
      categoryNames = await getCategoryNames();
      console.log('done getting category names');
    } catch (error) {
      throw new Error(error);
    }
  }

  init();

  let categoryNames$1;

  function typeaheadSubstringMatcher(strs) {
    return function matcher(q, cb) {
      const matches = [];

      const substrRegex = new RegExp(q, 'i');

      $.each(strs, function eachMatcher(_i, str) {
        if (substrRegex.test(str)) {
          matches.push(str);
        }
      });

      cb(matches);
    };
  }

  function setCategories() {
    $('#collapseOne .typeahead').typeahead(
      {
        hint: true,
        highlight: true,
        minLength: 1
      },
      {
        name: 'categories',
        source: typeaheadSubstringMatcher(categoryNames$1)
      }
    );
  }

  async function init$1() {
    try {
      categoryNames$1 = await getCategoryNames();
      setCategories();
    } catch (error) {
      throw new Error(error);
    }
  }

  init$1();

  let categoryNames$2;

  async function init$2() {
    try {
      categoryNames$2 = await getCategoryNames();
    } catch (error) {
      throw new Error(error);
    }
  }

  init$2();

  if (document.domain === 'localhost') {
    $('#mcqQuestion').val('This is the first question');
    $('mcqCategory').val('Acute Aortic Syndrome Radiology');
  }

  const errorMessages = {
    mcqCategory: {
      required: 'Your Q&A requires a category.'
    },
    mcqQuestion: {
      required: 'Your Q&A needs a question.'
    },
    answer: {
      required: 'Your Q&A needs 2 or more answers.'
    },
    responses: {
      required: 'Your answers must have responses.'
    }
  };

  function checkTextBoxes() {
    if (!this.checkValidity()) {
      $(this).addClass('is-invalid');
      $(`label[for=${$(this).attr('id')}]`).text(errorMessages[$(this).attr('id')].required);
    } else {
      $(this)
        .addClass('is-valid')
        .removeClass('is-invalid');
      $(`label[for=${$(this).attr('id')}]`).text('');
    }
    $('.needs-validation .step-btn').prop('disabled', !this.closest('form').checkValidity());
  }

  function continueToNextSection() {
    $('.needs-validation .step-btn').prop('disabled', !this.closest('form').checkValidity());

    const nextSection = $(this)
      .closest('form')
      .data('nextSection');

    $(`#${nextSection}`)
      .find('button:first')
      .prop('disabled', !this.closest('form').checkValidity());
  }

  function update() {
    $('.needs-validation')
      .find('input,select,textarea')
      .keyup(checkTextBoxes)
      .change(continueToNextSection);
  }

  update();

  $('#collapseOne .typeahead').bind('typeahead:select', function typeaheadSelect() {
    checkTextBoxes.call(this);
  });

  function checkMCQCategory() {
    if (categoryNames$2.indexOf($(this).val()) > -1) {
      $(this).removeClass('is-invalid');
      $(this).addClass('is-valid');
    } else {
      $(this).addClass('is-invalid');
      $(this).removeClass('is-valid');
    }
  }

  $('#mcqCategory').keyup(checkMCQCategory);

  let numberOfAnswersCounter = 0;
  function addAnswerInputBoxButtonClick() {
    numberOfAnswersCounter += 1;

    $('#answers').append(
      `<div id="answer${numberOfAnswersCounter}" class="input-group mb-3">
      <div class="input-group-prepend">
        <span class="input-group-text">${numberOfAnswersCounter}.</span>
      </div>
      <input type="text" class="form-control answer" placeholder="Type an answer here" required>
      <div class="input-group-append d-none">
        <button class="btn btn-outline-secondary add-question-button" type="button">Add Answer</button>
      </div>
    </div>`
    );

    if (document.domain === 'localhost') {
      $(`#answer${numberOfAnswersCounter}`)
        .find('.answer')
        .val(`This is answer ${numberOfAnswersCounter}`);
    }
    const buttons = $(document.getElementsByClassName('input-group-append'));
    buttons
      .addClass('d-none')
      .last()
      .removeClass('d-none');
    update();
  }

  function createSelectCorrectAnswer() {
    const sel = $('#correctAnswer');

    $('.answer').each(function addOption() {
      sel.append(
        $('<option>')
          .attr('value', $(this).val())
          .text($(this).val())
      );
    });

    update();
  }

  function createExplanationField(answerNumber, parentElement, required) {
    let textAreaId = 'response';
    textAreaId += answerNumber.toString();
    const answerResponse = $(`<textarea>This is explanation ${textAreaId}</textarea>`)
      .addClass('md-textarea form-control explanation')
      .prop('rows', '4')
      .prop('required', required)
      .prop('placeholder', 'Type what you would like to display when this answer is selected')
      .prop('id', textAreaId);
    let textAreaErrorId = 'responseError';
    textAreaErrorId += answerNumber.toString();
    const responseError = $('<label></label>')
      .addClass('text-danger form-text')
      .prop('id', textAreaErrorId);
    parentElement.append(answerResponse).append(responseError);
  }

  function createLabel(text, classes, uniqueName, parentElement) {
    const answerLabel = $('<label></label>')
      .addClass(classes)
      .text(text)
      .prop('id', uniqueName);
    parentElement.append(answerLabel);
  }

  function createExplanationFields() {
    for (let i = 0; i < numberOfAnswersCounter; i += 1) {
      if ($('#answers').find('input')[i].value !== '') {
        let labelId = 'answerLabel';
        labelId += i.toString();
        createLabel($('#answers').find('input')[i].value, 'nameOfAnswer', labelId, $('#answers'));
        createExplanationField(i, $('#answersResponses'), true);
        update();
      }
    }
  }

  function writeSuccess(el) {
    $('#postQuestionSuccess').append($(`<p>${JSON.stringify(el.question)}</p>`));
  }

  function writeError(el) {
    const message = el.msg ? el.msg : el;
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

      const promise = await fetch('http://localhost:3000/api/v1/questions', {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(question), // data can be `string` or {object}!
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const result = await promise.json();

      if (result.error) {
        $('#postQuestionError').removeClass('d-none');
        if (result.error.message instanceof Array) {
          result.error.message.forEach(writeError);
        } else if (result.error.message instanceof String) {
          writeError(result.error.message);
        } else if (result.error.message.toString instanceof Function) {
          writeError(result.error.message.toString());
        } else {
          writeError(`An error occurred: ${result.error}`);
        }
      } else {
        $('#postQuestionSuccess').removeClass('d-none');
        writeSuccess(result);
      }
    } catch (error) {
      // const message = await error.json();
      console.log('error', error);
    }
  }

  let categoryNames$3;

  async function init$3() {
    try {
      categoryNames$3 = await getCategoryNames();
    } catch (error) {
      throw new Error(error);
    }
  }

  init$3();

  $('#mcqQuestion').keyup(function iQuestionKeyUp() {
    if ($(this).val().length < 5) {
      $(this)
        .addClass('is-invalid')
        .removeClass('is-valid');
      $('#checkQandALength').text('Your Q&A name must be at least 5 characters long.');
    } else {
      $(this)
        .addClass('is-valid')
        .removeClass('is-invalid');
      $('#checkQandALength').text('');

      $('#mcqCategory').keyup(function qKeyUp() {
        if (categoryNames$3.indexOf($(this).val()) > -1) {
          $(this).removeClass('is-invalid');
          $(this).addClass('is-valid');
        } else {
          $(this).addClass('is-invalid');
          $(this).removeClass('is-valid');
        }
      });
      $('.tt-suggestion .tt-selectable').click(function suggestionClick() {
        $('#mcqCategory')
          .addClass('is-valid')
          .removeClass('is-invalid');
      });
      $('#mcqQuestion').keyup(function inputQKeyup() {
        if ($(this).val().length < 5) {
          $(this)
            .addClass('is-invalid')
            .removeClass('is-valid');
          $('#mcqLabel').text('Your Q&A name must be at least 5 characters long.');
        } else {
          $(this)
            .addClass('is-valid')
            .removeClass('is-invalid');
          $('#mcqLabel').text('');
        }
      });
    }
  });

  // import '../../../../scss/main.scss';

  $('#answers').on('click', '.add-question-button', addAnswerInputBoxButtonClick);
  addAnswerInputBoxButtonClick();
  addAnswerInputBoxButtonClick();

  function removeItemsFromStep3() {
    $('#correctAnswer')
      .children()
      .remove();
    $('textarea').remove();
    $('.nameOfAnswer').remove();
  }

  function createItemsForStep3() {
    createSelectCorrectAnswer();
    createExplanationFields();
  }

  function saveStep2() {
    removeItemsFromStep3();
    createItemsForStep3();
  }

  $('#step2Save').click(saveStep2);

  $('#submitButton').click(saveQuestion);

}());
