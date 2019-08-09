import '../services/step1';
import '../services/step2';
import { initStep3 } from '../services/step3';

function continueToNextSection() {
  $('.needs-validation .step-btn').prop('disabled', !this.closest('form').checkValidity());
  const nextSection = $(this)
    .closest('form')
    .data('nextSection');

  $(`#${nextSection}`)
    .find('button:first')
    .prop('disabled', !this.closest('form').checkValidity());
}

$('.needs-validation')
  .find('input, textarea')
  .on('keyup focus blur change', continueToNextSection);

$('#nextStepButton1').click(continueToNextSection);

$('#step2Save').click(initStep3);
