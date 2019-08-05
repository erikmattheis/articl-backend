function markInvalid(context) {
  console.log('invalid');
  $(context)
    .addClass('is-invalid')
    .removeClass('is-valid');
}

function markValid(context) {
  console.log('valid');
  $(context)
    .addClass('is-valid')
    .removeClass('is-invalid');
}
export { markInvalid, markValid };
