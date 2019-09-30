if ($(".list-detail-document").height() > 592) {
  $('.list-detail-document').css("padding-right","30px");
}
if ($(".list-document").height() < 592) {
  $('.list-document').css("width","100%");
}
$( document ).ready(function(){
//   Hide the border by commenting out the variable below
    var $on = 'section';
    $($on).css({
      'background':'none',
      'border':'none',
      'box-shadow':'none'
    });
}); 