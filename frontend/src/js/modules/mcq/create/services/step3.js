import { markInvalid, markValid } from '../../shared/forms/validationStyles';
import saveQuestion from '../models/saveQuestion';

function enableOtherSections(enable) {
  $('#sectionOne')
    .find('button:first')
    .prop('disabled', !enable);
  $('#sectionTwo')
    .find('button:first')
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

function createExplanationField(answerNumber, parentElement, required) {
  const textAreaId = `response${answerNumber}`;
  const answerResponse = $(`<textarea>This is explanation ${textAreaId}</textarea>`)
    .addClass('md-textarea form-control explanation')
    .prop('rows', '4')
    .prop('required', required)
    .prop('placeholder', 'Type what you would like to display when this answer is selected')
    .prop('id', textAreaId);
  const textAreaErrorId = `responseError${answerNumber}`;
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
  const tr = $(this)
    .find('option:selected')
    .val();
  console.log('tr', tr);
  console.log('answer', $('#correctAnswer').val());
  if (!$('#correctAnswer').val()) {
    markInvalid($('#correctAnswer'));
    enableOtherSections(false);
    return false;
  }

  markValid($('#correctAnswer'));
  return true;
}
$('#correctAnswer').on('change blur', checkCorrectAnswer);

function checkMCQExplnation() {
  if ($(this).val().length < 5) {
    enableOtherSections(false);
    markInvalid($(this));
    return false;
    // $('#checkQandALength').text('Your question must be at least 5 characters long.');
  }

  markValid($(this));
  return true;
  // $('#checkQandALength').text('');
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
  $('#submitButton').prop('disabled', 'disabled');
  $('#submitButton')
    .find('.spinner')
    .removeClass('d-none');
  if (!checkCorrectAnswer() || !checkAllFields()) {
    return false;
  }
  return saveQuestion();
}

$('#submitButton').click(submitMCQ);

$('#answerExplanations textarea').on('keyup focus blur change', checkMCQExplnation);

export { initStep3 };
