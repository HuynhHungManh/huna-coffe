function onclickShowMessage() {
  document.getElementById('showMessage').style.display = "block";
  $('#showMessage').delay(3000).hide(0);
}

function onclickHideMessage() {
  document.getElementById('showMessage').style.display = "none";
}

function clearInput() {
  $(document).ready(function() {
    $('.form-fb').find('input:text').val('');
    $('.form-fb').find('textarea').val('');
    $('#ipt-name').focus();
  });
}
