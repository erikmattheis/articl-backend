import { markInvalid, markValid } from '../../shared/forms/validationStyles';

let numberOfAnswersCounter = 0;
function addAnswerInputBoxButtonClick() {
  numberOfAnswersCounter += 1;

  $('#answers').append(
    `<div id="answer${numberOfAnswersCounter}" class="input-group mb-3">
      <div class="input-group-prepend">
        <span class="input-group-text">${numberOfAnswersCounter}.</span>
      </div>
      <input type="text" class="form-control answer" placeholder="Type an answer here" required>
      <div class="input-group-append d-none">
        <button class="btn btn-outline-secondary add-question-button" type="button">Add Answer</button>
      </div>
    </div>`
  );

  $('#answers').on('click', '.add-question-button', addAnswerInputBoxButtonClick);

  if (document.domain === 'localhost') {
    $(`#answer${numberOfAnswersCounter}`)
      .find('.answer')
      .val(`This is answer ${numberOfAnswersCounter}`);
  }
  const buttons = $(document.getElementsByClassName('input-group-append'));
  buttons
    .addClass('d-none')
    .last()
    .removeClass('d-none');
}

addAnswerInputBoxButtonClick();
addAnswerInputBoxButtonClick();

function checkMCQAnswer() {
  if ($(this).val().length < 1) {
    markInvalid($(this));
    // $('#checkQandALength').text('Your question must be at least 5 characters long.');
  } else {
    markValid($(this));
    // $('#checkQandALength').text('');
  }
}

$('#answers .answer').on('keyup focus blur change', checkMCQAnswer);
