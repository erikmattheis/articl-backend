import { markInvalid, markValid } from '../../shared/forms/validationStyles';
import saveQuestion from '../models/saveQuestion';

function enableOtherSections(enable) {
  $('#sectionOne')
    .find('button:first')
    .prop('disabled', !enable);
  $('#sectionTwo')
    .find('button:first')
    .prop('disabled', !enable);
  $('#sectionThree')
    .find('button')
    .prop('disabled', !enable);
}

let numberOfAnswersCounter;
let numberOfExplanationsCounter;
function createSelectCorrectAnswer() {
  for (let i = numberOfExplanationsCounter; i < numberOfAnswersCounter; i += 1) {
    if ($('#answers').find('input')[i].value !== '') {
      $('#correctAnswer').append(
        $('<option>')
          .attr('value', $('#answers').find('input')[i].value)
          .text($('#answers').find('input')[i].value)
      );
    }
  }
}

function expandTextfield() {
  this.style.height = '';
  this.style.height = `${this.scrollHeight}px`;
}

function createExplanationField(answerNumber, parentElement, required) {
  const textAreaId = `explanation${answerNumber}`;
  const answerResponse = $(`<textarea></textarea>`)
    .addClass('md-textarea form-control explanation')
    .prop('required', required)
    .prop('rows', 1)
    .prop('placeholder', 'Type what you would like to display when this answer is selected')
    .prop('id', textAreaId);
  answerResponse.on('keyup', expandTextfield);

  if (document.domain === 'localhost2') {
    answerResponse.val('Explanation text');
  }
  const explanationFeedback = $('<div/>')
    .addClass('form-text text-danger')
    .prop('id', `explanation${answerNumber}Feedback`);
  parentElement.append(answerResponse).append(explanationFeedback);
}

function createLabel(text, classes, uniqueName, parentElement) {
  const answerLabel = $('<label></label>')
    .addClass(classes)
    .text(text)
    .prop('id', uniqueName);
  parentElement.append(answerLabel);
}

function createExplanationFields() {
  for (let i = numberOfExplanationsCounter; i < numberOfAnswersCounter; i += 1) {
    if ($('#answers').find('input')[i].value !== '') {
      const labelId = `answerLabel${i}`;
      createLabel($('#answers').find('input')[i].value, 'nameOfAnswer', labelId, $('#answerExplanations'));
      createExplanationField(i, $('#answerExplanations'), true);
    }
  }
}

function initStep3() {
  numberOfAnswersCounter = $('#answers').find('input').length;
  numberOfExplanationsCounter = $('#answerExplanations').find('textarea').length;
  createSelectCorrectAnswer();
  createExplanationFields();
}

function checkCorrectAnswer() {
  if (!$('#correctAnswer').val()) {
    markInvalid($('#correctAnswer'));
    $('#correctAnswerFeedback').text('Please select the correct answer');
    enableOtherSections(false);
    return false;
  }

  markValid($('#correctAnswer'));
  $('#correctAnswerFeedback').text('');
  enableOtherSections(true);
  return true;
}

$('#correctAnswer').on('focus change', checkCorrectAnswer);

function checkMCQExplnation() {
  if ($(this).val().length < 5) {
    enableOtherSections(false);
    markInvalid($(this));
    $(`${$(this).prop('id')}Feedback`).text('Explanations must be at least five characters long.');

    return false;
  }

  markValid($(this));
  $(`${$(this).prop('id')}Feedback`).text('');

  return true;
}

function checkAllFields() {
  let passed = true;
  $('#answerResponses textarea').each(function check() {
    if (!checkMCQExplnation.call(this)) {
      passed = false;
      enableOtherSections(false);
      return false;
    }
    return true;
  });
  if (passed) {
    enableOtherSections(true);
  }
  return passed;
}

function submitMCQ() {
  if (!checkCorrectAnswer() || !checkAllFields()) {
    return false;
  }
  $('#submitButton').prop('disabled', 'disabled');
  $('#submitButton')
    .find('.spinner')
    .removeClass('d-none');
  return saveQuestion();
}

$('#submitButton').click(submitMCQ);

$('#answerExplanations textarea').on('keyup focus change', checkMCQExplnation);

export default initStep3;
