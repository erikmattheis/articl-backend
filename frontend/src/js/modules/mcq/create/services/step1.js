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

function enableOtherSections(enable) {
  $('#sectionTwo')
    .find('button:first')
    .prop('disabled', !enable);
  $('#sectionThree')
    .find('button:first')
    .prop('disabled', !enable);
}

function checkMCQuestionPassed() {
  return $('#mcqQuestion').val().length < 5;
}

function checkMCQuestion() {
  if (checkMCQuestionPassed()) {
    markInvalid($('#mcqQuestion'));
    $('#checkQandALength').text('Your question must be at least 5 characters long.');
    enableOtherSections(false);
    return false;
  }
  markValid($('#mcqQuestion'));
  $('#checkQandALength').text('');
  enableOtherSections(true);
  return true;
}

$('#mcqQuestion').on('keyup focus blur', checkMCQuestion);

function isCategoryPassed() {
  return categoryNames.indexOf($('#mcqCategory').val()) > -1;
}

function isCategory() {
  if (isCategoryPassed()) {
    markValid($('#mcqCategory'));
    enableOtherSections(true);
    return true;
  }
  markInvalid($('#mcqCategory'));
  enableOtherSections(false);
  return false;
}
$('#mcqCategory').on('keyup focus blur', isCategory);
$('#mcqCategory').bind('typeahead:select', isCategory);

function checkAllFields() {
  let passed;

  if (isCategory() && checkMCQuestion()) {
    passed = true;
  } else {
    passed = false;
  }
  enableOtherSections(passed);

  return passed;
}
$('#mcqQuestion').change(checkAllFields);
$('#nextStepButton1').click(checkAllFields);
