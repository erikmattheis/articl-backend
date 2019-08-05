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

$('#mcqQuestion').keyup(function mcqQuestionKeyUp() {
  if ($(this).val().length < 5) {
    markInvalid($(this));
    $('#checkQandALength').text('Your question must be at least 5 characters long.');
  } else {
    markValid($(this));
    $('#checkQandALength').text('');
  }
});

$('#mcqCategory').keyup(function mcqCategoryKeyUp() {
  if (categoryNames.indexOf($(this).val()) > -1) {
    markValid($(this));
  } else {
    markInvalid($(this));
  }
});

$('#collapseOne .typeahead').bind('typeahead:select', function typeaheadSelect() {
  if (categoryNames.indexOf($(this).val()) > -1) {
    markValid($('#mcqCategory'));
  } else {
    markInvalid($('#mcqCategory'));
  }
});

function checkMCQCategory() {
  if (categoryNames.indexOf($(this).val()) > -1) {
    $(this).removeClass('is-invalid');
    $(this).addClass('is-valid');
  } else {
    $(this).addClass('is-invalid');
    $(this).removeClass('is-valid');
  }
}

$('#mcqCategory').keyup(checkMCQCategory);

$('.tt-suggestion .tt-selectable').click(function suggestionClick() {
  markValid($(this));
});
