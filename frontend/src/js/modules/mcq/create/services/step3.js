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

function createSelectCorrectAnswer() {
  $('.answer').each(function addOption() {
    $('#correctAnswer').append(
      $('<option>')
        .attr('value', $(this).val())
        .text($(this).val())
    );
  });
}

function createExplanationField(answerNumber, parentElement, required) {
  let textAreaId = `response${answerNumber}`;
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

let numberOfAnswersCounter;
let numberOfExplanationsCounter;
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
  $('#correctAnswer').val();
  if (!$('#correctAnswer').val().length) {
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
  if (!checkCorrectAnswer() || !checkAllFields()) {
    return false;
  }
  return saveQuestion();
}

$('#submitButton').click(submitMCQ);

$('#answerExplanations textarea').on('keyup focus blur change', checkMCQExplnation);

export { initStep3 };
