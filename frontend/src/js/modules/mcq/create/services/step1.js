import './typeaheadSubstringMatcher';

import { getCategoryNames } from '../../shared/models/Categories';
import { markInvalid, markValid } from '../../shared/forms/validationStyles';

let categoryNames;

async function init() {
  try {
    categoryNames = await getCategoryNames();
  } catch (error) {
    throw new Error(error);
  }
}

init();

function checkMCQuestionPassed() {
  return $('#mcqQuestion').val().length < 5;
}
function checkMCQuestion() {
  if (checkMCQuestionPassed()) {
    markInvalid($('#mcqQuestion'));
    $('#checkQandALength').text('Your question must be at least 5 characters long.');
    return false;
  }
  markValid($('#mcqQuestion'));
  $('#checkQandALength').text('');
  return true;
}

$('#mcqQuestion').on('keyup focus blur', checkMCQuestion);

function isCategoryPassed() {
  return categoryNames.indexOf($('#mcqCategory').val()) > -1;
}

function isCategory() {
  if (isCategoryPassed()) {
    markValid($('#mcqCategory'));
    return true;
  }
  markInvalid($('#mcqCategory'));
  return false;
}
$('#mcqCategory').on('keyup focus blur', isCategory);
$('#mcqCategory').bind('typeahead:select', isCategory);

/*
$('.needs-validation')
  .find('input, textarea')
  .on('keyup focus blur change', continueToNextSection);
*/

function checkAllFields() {
  console.log('checkAllFields');
  let passed;
  console.log(isCategory(), checkMCQuestion());
  if (isCategory() && checkMCQuestion()) {
    console.log('passed');
    passed = true;
  } else {
    console.log('not passed');
    passed = false;
  }
  $('collapseTwo')
    .find('button:first')
    .prop('disabled', !passed);
  $('collapseThree')
    .find('button:first')
    .prop('disabled', !passed);
  return passed;
  /*
  $('.needs-validation .step-btn').prop('disabled', !this.closest('form').checkValidity());
  const nextSection = $(this)
    .closest('form')
    .data('nextSection');

  $(`#${nextSection}`)
    .find('button:first')
    .prop('disabled', !this.closest('form').checkValidity());
  */
}
$('#mcqQuestion').change(checkAllFields);
$('#nextStepButton1').click(checkAllFields);
