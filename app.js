//Дэлгэцтэй ажиллах controller
var uiController = (function() {})();

//Санхүүтэй ажиллах controller
var financeController = (function() {})();

//Холбогч controller
var connectController = (function(uiController, financeController) {
  function ctrlAddItem() {
    //Хийсэн үйлдлийг харуулна
    //Санхүүгийн тооцоо хийнэ
    //
  }

  document.querySelector(".add__btn").addEventListener("click", function() {
    ctrlAddItem();
  });

  document.addEventListener("keypress", function(event) {
    if (event.keyCode === 13 || event.which === 13) {
      ctrlAddItem();
    }
  });
})(uiController, financeController);
