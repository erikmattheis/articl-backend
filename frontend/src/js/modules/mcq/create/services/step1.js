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

function checkMCQuestion() {
  console.log('checkMCQuestion');
  if ($(this).val().length < 5) {
    markInvalid($(this));
    $('#checkQandALength').text('Your question must be at least 5 characters long.');
  } else {
    markValid($(this));
    $('#checkQandALength').text('');
  }
}

$('#mcqQuestion').on('keyup focus blur change', checkMCQuestion);
$('#mcqQuestion').on('change', continueToNextSection);

function isCategory() {
  if (categoryNames.indexOf($(this).val()) > -1) {
    markValid($('#mcqCategory'));
  } else {
    markInvalid($('#mcqCategory'));
  }
}

$('#mcqCategory').on('keyup focus blur change', isCategory);
$('#mcqCategory').bind('typeahead:select', isCategory);

/*
$('.needs-validation')
  .find('input, textarea')
  .on('keyup focus blur change', continueToNextSection);
*/

function continueToNextSection() {
  console.log('continueToNextSection');
  console.log();
  if (isCategory() && $('#mcqQuestion').keyup()) {
    console.log('passed');
  } else {
    console.log('not passed');
  }

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

$('#mcqCategory').on('change', continueToNextSection);
$('#nextStepButton1').click(continueToNextSection);
