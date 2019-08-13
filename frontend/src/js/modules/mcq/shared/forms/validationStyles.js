function markInvalid(context) {
  $(context)
    .addClass('is-invalid')
    .removeClass('is-valid');
}

function markValid(context) {
  $(context)
    .addClass('is-valid')
    .removeClass('is-invalid');
}
export { markInvalid, markValid };
