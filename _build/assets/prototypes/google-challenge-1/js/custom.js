// Lucky Animation - tried to do this with CSS media queries/keyframe animations initially
$(".lucky").hover(function(){
  var self = this;
  var pos = -(Math.floor(Math.random() * 5) + 1) * 40
  setTimeout(function(){
    $(self).find("ul").css("margin-top", pos + "px");
  }, 300);
}, function(){
  $(this).find("ul").css("margin-top", "0px");
})