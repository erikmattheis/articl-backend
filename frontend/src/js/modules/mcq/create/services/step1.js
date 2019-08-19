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

function enableOrDisableOtherSections(enable) {
  $('#sectionTwo')
    .find('button:first')
    .prop('disabled', enable);
  $('#sectionThree')
    .find('button:first')
    .prop('disabled', enable);
}

function checkMCQuestionPassed() {
  return $('#mcqQuestion').val().length < 5;
}
function checkMCQuestion() {
  if (checkMCQuestionPassed()) {
    markInvalid($('#mcqQuestion'));
    $('#checkQandALength').text('Your question must be at least 5 characters long.');
    enableOrDisableOtherSections(false);
    return false;
  }
  markValid($('#mcqQuestion'));
  $('#checkQandALength').text('');
  enableOrDisableOtherSections(true);
  return true;
}

$('#mcqQuestion').on('keyup focus blur', checkMCQuestion);

function isCategoryPassed() {
  return categoryNames.indexOf($('#mcqCategory').val()) > -1;
}

function isCategory() {
  if (isCategoryPassed()) {
    markValid($('#mcqCategory'));
    enableOrDisableOtherSections(true);
    return true;
  }
  markInvalid($('#mcqCategory'));
  enableOrDisableOtherSections(false);
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
  enableOrDisableOtherSections(!passed);
  $('#sectionTwo')
    .find('button:first')
    .prop('disabled', !passed);
  $('#sectionThree')
    .find('button:first')
    .prop('disabled', !passed);
  return passed;
}
$('#mcqQuestion').change(checkAllFields);
$('#nextStepButton1').click(checkAllFields);
