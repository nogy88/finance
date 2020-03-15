//Дэлгэцтэй ажиллах controller
var uiController = (function() {
  var DOMstring = {
    inputType: ".add__type",
    inputDesc: ".add__description",
    inputValue: ".add__value",
    addBtn: ".add__btn"
  };

  return {
    inputValue: function() {
      return {
        Type: document.querySelector(DOMstring.inputType).value,
        Desc: document.querySelector(DOMstring.inputDesc).value,
        Value: document.querySelector(DOMstring.inputValue).value
      };
    },
    getDOMstring: function() {
      return DOMstring;
    }
  };
})();

//
//
//Санхүүтэй ажиллах controller
var financeController = (function() {
  var income = function(type, description, value) {
    this.type = type;
    this.description = description;
    this.value = value;
  };

  var expense = function(type, description, value) {
    this.type = type;
    this.description = description;
    this.value = value;
  };

  var data = {
    allItems: {
      inc: [],
      exp: []
    },

    totals: {
      inc: 0,
      exp: 0
    }
  };
})();

//
//
//Холбогч controller
var appController = (function(uiController, financeController) {
  function ctrlAddItem() {
    //Оруулах өгөгдлийг дэлгэцнээс олж авна.
    console.log(uiController.inputValue());
    //Оруулсан өгөгдлүүдээ санхүүгийн контроллерт дамжуулж тэндээ хадгална.
    //Олж авсан өгөгдлүүдээ вэб дээр тохирох хэсэгт харуулна.
    //Төсвийг тооцно.
    //Эцсийн үлдэгдлийг дэлгэцэнд гаргана.
  }
  var setupEventListeners = function() {
    var DOM = uiController.getDOMstring();
    document.querySelector(DOM.addBtn).addEventListener("click", function() {
      ctrlAddItem();
    });

    document.addEventListener("keypress", function(event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
  };

  return {
    init: function() {
      console.log("starting...");
      setupEventListeners();
    }
  };
})(uiController, financeController);

//Бүх үйл ажиллагааг шинээр эхлүүлэх функц дуудсан
appController.init();
