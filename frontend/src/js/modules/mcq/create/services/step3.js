import { markInvalid, markValid } from '../../shared/forms/validationStyles';
import saveQuestion from '../models/saveQuestion';

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

const numberOfAnswersCounter = $('#answers').children().length;

function createExplanationFields() {
  for (let i = 0; i < numberOfAnswersCounter; i += 1) {
    if ($('#answers').find('input')[i].value !== '') {
      let labelId = 'answerLabel';
      labelId += i.toString();
      createLabel($('#answers').find('input')[i].value, 'nameOfAnswer', labelId, $('#answers'));
      createExplanationField(i, $('#answersResponses'), true);
    }
  }
}

function initStep3() {
  createSelectCorrectAnswer();
  createExplanationFields();
}

function checkCorrectAnswer() {
  $('#correctAnswer').val();
  if (!$('#correctAnswer').val().length) {
    markInvalid($('#correctAnswer'));
    return false;
  }

  markValid($('#correctAnswer'));
  return true;
}
$('#correctAnswer').on('change blur', checkCorrectAnswer);

function submitMCQ() {
  if (checkCorrectAnswer()) {
    saveQuestion();
  }
}

$('#submitButton').click(submitMCQ);

function checkMCQExplnation() {
  if ($(this).val().length < 5) {
    markInvalid($(this));
    // $('#checkQandALength').text('Your question must be at least 5 characters long.');
  } else {
    markValid($(this));
    saveQuestion();
    // $('#checkQandALength').text('');
  }
}

$('#answersResponses textarea').on('keyup focus blur change', checkMCQExplnation);

export { initStep3 };
