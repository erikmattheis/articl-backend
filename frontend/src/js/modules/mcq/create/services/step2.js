import initStep3 from './step3';
import { markInvalid, markValid } from '../../shared/forms/validationStyles';

function enableOtherSections(enable) {
  $('#sectionOne')
    .find('button:first')
    .prop('disabled', !enable);
  $('#sectionTwo')
    .find('button')
    .prop('disabled', !enable);
  $('#sectionThree')
    .find('button:first')
    .prop('disabled', !enable);
}

function checkMCQDuplicate(element) {
  let passed = true;
  $('#answers input').each(function check() {
    if (
      JSON.stringify(element) !== JSON.stringify($(this)) &&
      element
        .val()
        .toLowerCase()
        .trim() ===
        $(this)
          .val()
          .toLowerCase()
          .trim()
    ) {
      markInvalid($(this));
      markInvalid(element);
      $(`#${element.prop('id')}Feedback`).text('Please enter a unique answer.');
      passed = false;
      return false;
    }
    return passed;
  });
  if (passed) {
    markValid(element);
    $(`#${element.prop('id')}Feedback`).text('');
    return true;
  }
  return false;
}

function checkMCQAnswer() {
  if ($(this).val().length < 1) {
    markInvalid($(this));
    $(`#${$(this).prop('id')}Feedback`).text('Answers must be at least one character long.');
    return false;
  }
  markValid($(this));
  $(`#${$(this).prop('id')}Feedback`).text('');
  return true;
}

let numberOfAnswersCounter = 0;
function addAnswerInputBoxButtonClick() {
  numberOfAnswersCounter += 1;

  $('#answers').append(
    `<div class="input-group mb-3">
      <div class="input-group-prepend">
        <span class="input-group-text">${numberOfAnswersCounter}.</span>
      </div>
      <input id="answer${numberOfAnswersCounter}" type="text" class="form-control answer" placeholder="Type an answer here" required>
      <div class="input-group-append d-none">
        <button class="btn btn-outline-secondary add-question-button" type="button">Add Answer</button>
      </div>
    </div>
    <div id="answer${numberOfAnswersCounter}Feedback" class="form-text text-danger"></div>`
  );

  if (document.domain === 'localhost2') {
    $(`#answer${numberOfAnswersCounter}`).val(`This is answer ${numberOfAnswersCounter}`);
  }

  const buttons = $(document.getElementsByClassName('input-group-append'));
  buttons.addClass('d-none');

  if (numberOfAnswersCounter < 5) {
    buttons.last().removeClass('d-none');
  }
}

addAnswerInputBoxButtonClick();
addAnswerInputBoxButtonClick();

$('#answers').on('click', '.add-question-button', addAnswerInputBoxButtonClick);

function checkAllFields() {
  let passed = true;
  $('#answers input').each(function check() {
    if (!checkMCQAnswer.call(this)) {
      passed = false;
      enableOtherSections(false);
      return false;
    }
    if (!checkMCQDuplicate.call(this, $(this))) {
      passed = false;
      enableOtherSections(false);
      return false;
    }

    return true;
  });
  if (passed) {
    enableOtherSections(true);
    initStep3();
  }
  return passed;
}

$('#answers input').on('blur change focus keyup', checkAllFields);

$('#nextStepButton2').click(checkAllFields);
