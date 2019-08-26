import './typeaheadSubstringMatcher';

import getCategoryNames from '../../shared/models/Categories';
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
  $('#sectionOne')
    .find('button')
    .prop('disabled', !enable);
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
    $('#mcqQuestionFeedback').text('Your question must be at least 5 characters long.');
    enableOtherSections(false);
    return false;
  }
  markValid($('#mcqQuestion'));
  $('#mcqQuestionFeedback').text('');
  enableOtherSections(true);
  return true;
}
$('#mcqQuestion').on('keyup focus', checkMCQuestion);

function isCategoryPassed() {
  return categoryNames.indexOf($('#mcqCategory').val()) > -1;
}

function isCategory() {
  if (isCategoryPassed()) {
    markValid($('#mcqCategory'));
    $('#mcqCategoryFeedback').text('');
    enableOtherSections(true);
    return true;
  }
  markInvalid($('#mcqCategory'));
  $('#mcqCategoryFeedback').text('Please choose or enter a valid category.');
  enableOtherSections(false);
  return false;
}

$('#mcqCategory').on('keyup focus', isCategory);
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

$('#mcqQuestion').on('change', checkAllFields);
$('#mcqCategory').on('change', checkAllFields);
$('#nextStepButton1').click(checkAllFields);
