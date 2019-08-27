import getCategoryNames from '../../shared/models/Categories';

let categoryNames;

function typeaheadSubstringMatcher(strs) {
  return function matcher(q, cb) {
    const matches = [];

    const substrRegex = new RegExp(q, 'i');

    $.each(strs, function eachMatcher(_i, str) {
      if (substrRegex.test(str)) {
        matches.push(str);
      }
    });

    cb(matches);
  };
}

function setCategories() {
  $('#collapseOne .typeahead').typeahead(
    {
      hint: true,
      highlight: true,
      minLength: 1
    },
    {
      name: 'categories',
      source: typeaheadSubstringMatcher(categoryNames)
    }
  );
  if (document.domain === 'localhost2') {
    $('#mcqQuestion').val('This is the first question');
    $('.typeahead').typeahead('val', 'Artificial Intelligence in Chest Radiology');
  }
}

async function init() {
  try {
    categoryNames = await getCategoryNames();
    setCategories();
  } catch (error) {
    throw new Error(error);
  }
}

init();
