$(document).ready(function(){
  $("p").hide()
  $("p.bio").show()
  $("li.link").on("click", function(){
    $("p").hide()
    var toShow = $(this).attr("class").split(" ")[0]
    $("p."+toShow).show()
  })
})