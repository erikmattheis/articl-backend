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
  if ($(this).val().length < 5) {
    markInvalid($(this));
    $('#checkQandALength').text('Your question must be at least 5 characters long.');
  } else {
    markValid($(this));
    $('#checkQandALength').text('');
  }
}

$('#mcqQuestion').on('keyup focus blur change', checkMCQuestion);

function isCategory() {
  if (categoryNames.indexOf($(this).val()) > -1) {
    markValid($('#mcqCategory'));
  } else {
    markInvalid($('#mcqCategory'));
  }
}

$('#mcqCategory').on('keyup focus blur change', isCategory);
$('#mcqCategory').bind('typeahead:select', isCategory);
