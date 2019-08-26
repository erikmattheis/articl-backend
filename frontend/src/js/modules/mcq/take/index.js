/*
$(document).ready(function main() {
  let question = {};
  let correctAnswer;
  function getQuestion(id) {
    $.getJSON(`https://immense-plains-76913.herokuapp.com/api/v1/questions/${  id}`).done(function(response) {
      question = response;
      function createAlert(correct, explanation) {
        return $('<div></div>')
          .addClass(correct)
          .text(explanation);
      }
      function makeClickable(theAnswer) {
        let explanation;
        return $('<p></p>').append(
          $('<a></a>')
            .prop('href', '')
            .text(theAnswer.answer)
            .click(function check() {
              $('.alert').remove();
              $('.isCorrect').remove();
              if (correctAnswer.answer === $(this).text()) {
                explanation = createAlert('alert alert-success', correctAnswer.explanation);

                $(this)
                  .parent()
                  .append(
                    $('<p></p>')
                      .html('&#10004;')
                      .addClass('isCorrect')
                      .append(explanation)
                  );
              } else {
                explanation = createAlert('alert alert-danger', theAnswer.explanation);
                $(this)
                  .parent()
                  .append(
                    $('<p></p>')
                      .html('&#10060;')
                      .addClass('isCorrect')
                      .append(explanation)
                  );
              }
              return false;
            })
        );
      }

      const createClickableText = function createRadio(answer) {
        const radioCheck = makeClickable(answer);

        $('#formContainer').append(radioCheck);
      };
      $('#questionName').text(question.questions.questions[0].question);
      for (let i = 0; i < question.questions.questions[0].answers.length; i += 1) {
        if (question.questions.questions[0].answers[i].correct) {
          correctAnswer = question.questions.questions[0].answers[i];
        }
        createClickableText(question.questions.questions[0].answers[i]);
      }
    });
  }

  getQuestion('5d3fa2c7d24526748df36fce');
});
*/
