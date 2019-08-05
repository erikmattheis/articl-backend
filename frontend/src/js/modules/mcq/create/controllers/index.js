import '../services/step1';
import '../services/step2';
import { initStep3 } from '../services/step3';

import saveQuestion from '../models/saveQuestion';

function continueToNextSection() {
  $('.needs-validation .step-btn').prop('disabled', !this.closest('form').checkValidity());
  console.log('check validity', !this.closest('form').checkValidity());
  const nextSection = $(this)
    .closest('form')
    .data('nextSection');

  $(`#${nextSection}`)
    .find('button:first')
    .prop('disabled', !this.closest('form').checkValidity());
}

$('.needs-validation')
  .find('input,select,textarea')
  .change(continueToNextSection);

$('#nextStepButton1').click(continueToNextSection);

$('#step2Save').click(initStep3);

$('#submitButton').click(saveQuestion);
