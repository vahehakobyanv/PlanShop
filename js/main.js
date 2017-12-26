
function myFunction() {
    location.replace("Main.html")
}
function dialogBoxOpen() {
    var txt;
    var person = prompt("Please enter your name:", "The Name Of your List");
    if (person == null || person == "") {
        txt = "User cancelled the prompt.";
    } else {
        txt = person;
        $('#lists').append(`<li>${txt}'  <button>&#10006</button></li>`);
    }

}
$(document).ready(function(){
    $(".sign_in_btn").click(function(){
       $(".log_reg_fix").css({
           "display":"block",
       });
       $(".fix_center_abs").animate({
           "top":"0px",
       },500);
    });
    $(".log_reg_fix").click(function(){
        $(this).css({
            "display":"none",
        });
        $(".fix_center_abs").animate({
            "top":"-1000px",
        },500);
        $(".fix_center_abs_2").animate({
            "top":"-1000px",
        },500);
    });
    $(".fix_center_abs").click(function(e){
        e.stopPropagation();
    });

    $(".sign_up_btn").click(function(){
        $(".log_reg_fix").css({
            "display":"block",
        });
        $(".fix_center_abs_2").animate({
            "top":"0px",
        },500);
    });
    $(".fix_center_abs_2").click(function(e){
        e.stopPropagation();
    });

    $(".add_btn").click(function(){
        $(".add_place").animate({
            "height":"150px",
        });
    });
});