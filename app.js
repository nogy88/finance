// Дэлгэцтэй ажиллах контроллер
var uiController = (function() {
  var DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    addBtn: ".add__btn",
    incomeList: ".income__list",
    expenseList: ".expenses__list",
    tusuvValue: ".budget__value",
    tusuvInc: ".budget__income--value",
    tusuvExp: ".budget__expenses--value",
    tusuvPercentage: ".budget__expenses--percentage",
    containerDiv: ".container",
    expPercentage: ".item__percentage",
    titleMonth: ".budget__title--month"
  };

  var nodeListForeach = function(list, callback) {
    for (var i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
  };

  var formatTusuv = function(too, type) {
    var a = "" + too;
    var b = a
      .split("")
      .reverse()
      .join("");

    var c = "";
    var count = 1;

    for (var i = 0; i < b.length; i++) {
      c = c + b[i];
      if (count % 3 === 0) c = c + ",";
      count++;
    }

    var d = c
      .split("")
      .reverse()
      .join("");

    if (d[0] === ",") d = d.substr(1, d.length - 1);

    if (type === "inc") d = "+ " + d;
    else d = "- " + d;
    return d;
  };

  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value, // exp, inc
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseInt(document.querySelector(DOMstrings.inputValue).value)
      };
    },

    displayMonth: function() {
      var ognoo = new Date();
      var sar = ognoo.getMonth() + 1;
      document.querySelector(DOMstrings.titleMonth).textContent =
        ognoo.getFullYear() + " оны " + sar + " сарын өрхийн санхүү";
    },

    changeType: function() {
      var field = document.querySelectorAll(
        DOMstrings.inputType +
          ", " +
          DOMstrings.inputDescription +
          ", " +
          DOMstrings.inputValue
      );

      nodeListForeach(field, function(el) {
        el.classList.toggle("red-focus");
      });

      document.querySelector(DOMstrings.addBtn).classList.toggle("red");
    },

    DisplayExpPercentageShow: function(allPercentage) {
      var items = document.querySelectorAll(DOMstrings.expPercentage);

      //Element bolgonii huvid zarlagiin huviig massivaas avch delgetsend gargah
      nodeListForeach(items, function(el, index) {
        el.textContent = allPercentage[index] + "%";
      });
    },

    getDOMstrings: function() {
      return DOMstrings;
    },

    clearFields: function() {
      var fields = document.querySelectorAll(
        DOMstrings.inputDescription + ", " + DOMstrings.inputValue
      );

      // Convert List to Array
      var fieldsArr = Array.prototype.slice.call(fields);

      fieldsArr.forEach(function(el, index, array) {
        el.value = "";
      });

      fieldsArr[0].focus();

      // for (var i = 0; i < fieldsArr.length; i++) {
      //   fieldsArr[i].value = "";
      // }
    },

    tusviigDelgetsruu: function(tusuv) {
      var type;
      if (tusuv.tusuv > 0) type = "inc";
      else type = "exp";
      document.querySelector(DOMstrings.tusuvValue).textContent = formatTusuv(
        tusuv.tusuv,
        type
      );
      document.querySelector(DOMstrings.tusuvInc).textContent = formatTusuv(
        tusuv.totalInc,
        "inc"
      );
      document.querySelector(DOMstrings.tusuvExp).textContent = formatTusuv(
        tusuv.totalExp,
        "exp"
      );
      if (tusuv.huvi !== 0) {
        document.querySelector(DOMstrings.tusuvPercentage).textContent =
          tusuv.huvi + "%";
      } else
        document.querySelector(DOMstrings.tusuvPercentage).textContent =
          tusuv.huvi;
    },

    deleteListItem: function(id) {
      var a = document.getElementById(id);
      a.parentNode.removeChild(a);
    },

    addListItem: function(item, type) {
      // Орлого зарлагын элементийг агуулсан html-ийг бэлтгэнэ.
      var html, list;
      if (type === "inc") {
        list = DOMstrings.incomeList;
        html =
          '<div class="item clearfix" id="inc-%id%"><div class="item__description">$$DESCRIPTION$$</div><div class="right clearfix"><div class="item__value">$$VALUE$$</div><div class="item__delete">            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div>        </div></div>';
      } else {
        list = DOMstrings.expenseList;
        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">$$DESCRIPTION$$</div>          <div class="right clearfix"><div class="item__value">$$VALUE$$</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn">                <i class="ion-ios-close-outline"></i></button></div></div></div>';
      }
      // Тэр HTML дотроо орлого зарлагын утгуудыг REPLACE ашиглаж өөрчилж
      html = html.replace("%id%", item.id);
      html = html.replace("$$DESCRIPTION$$", item.description);
      html = html.replace("$$VALUE$$", formatTusuv(item.value, type));

      // Бэлтгэсэн HTML ээ DOM руу хийж өгнө.
      document.querySelector(list).insertAdjacentHTML("beforeend", html);
    }
  };
})();

// Санхүүтэй ажиллах контроллер
var financeController = (function() {
  // private data
  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  // private data
  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calculatePercentage = function(totalIncome) {
    if (totalIncome !== 0)
      this.percentage = Math.round((this.value / totalIncome) * 100);
    else this.percentage = 0;
  };

  Expense.prototype.getPercentage = function() {
    return this.percentage;
  };

  // private data
  var data = {
    items: {
      inc: [],
      exp: []
    },

    totals: {
      inc: 0,
      exp: 0
    },

    tusuv: 0,

    huvi: 0
  };

  function calculateTusuv(type) {
    var sum = 0;
    data.items[type].forEach(function(el) {
      sum = sum + el.value;
    });
    data.totals[type] = sum;
  }

  return {
    deleteItem: function(type, id) {
      var ids = data.items[type].map(function(el) {
        return el.id;
      });

      var index = ids.indexOf(id);

      if (index !== -1) {
        data.items[type].splice(index, 1);
      }
    },

    calculatePercentages: function() {
      data.items.exp.forEach(function(el) {
        el.calculatePercentage(data.totals.inc);
      });
    },

    getPercentages: function() {
      var allPercentages = data.items.exp.map(function(el) {
        return el.getPercentage();
      });
      return allPercentages;
    },

    tusviigTootsoh: function() {
      calculateTusuv("inc");
      calculateTusuv("exp");

      data.tusuv = data.totals.inc - data.totals.exp;
      if (data.totals.inc !== 0)
        data.huvi = Math.round((data.totals.exp / data.totals.inc) * 100);
      else data.huvi = 0;
    },

    tusviigAvah: function() {
      return {
        tusuv: data.tusuv,
        huvi: data.huvi,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp
      };
    },

    addItem: function(type, desc, val) {
      var item, id;

      if (data.items[type].length === 0) id = 1;
      else {
        id = data.items[type][data.items[type].length - 1].id + 1;
      }

      if (type === "inc") {
        item = new Income(id, desc, val);
      } else {
        item = new Expense(id, desc, val);
      }

      data.items[type].push(item);

      return item;
    },

    seeData: function() {
      return data;
    }
  };
})();

// Програмын холбогч контроллер
var appController = (function(uiController, financeController) {
  var ctrlAddItem = function() {
    // 1. Оруулах өгөгдлийг дэлгэцээс олж авна.
    var input = uiController.getInput();

    if (input.description !== "" && input.value !== "") {
      // 2. Олж авсан өгөгдлүүдээ санхүүгийн контроллерт дамжуулж тэнд хадгална.
      var item = financeController.addItem(
        input.type,
        input.description,
        input.value
      );

      // 3. Олж авсан өгөгдлүүдээ вэб дээрээ тохирох хэсэгт нь гаргана
      uiController.addListItem(item, input.type);
      uiController.clearFields();

      updateTusuv();
    }
  };

  var updateTusuv = function() {
    // 4. Төсвийг тооцоолно
    financeController.tusviigTootsoh();

    // 5. Эцсийн үлдэгдлийг тооцоолно.
    var tusuvInfo = financeController.tusviigAvah();

    // 6. Эцсийн үлдэгдлийг дэлгэцэнд гаргана.
    uiController.tusviigDelgetsruu(tusuvInfo);

    // 7. Зарлагын хувийг тооцоолно
    financeController.calculatePercentages();

    // 8. Зарлагын хувийг авна.
    var allExpPerc = financeController.getPercentages();

    // 9. Зарлагын хувийг дэлгэцэнд харуулна.
    uiController.DisplayExpPercentageShow(allExpPerc);
  };

  var setupEventListeners = function() {
    var DOM = uiController.getDOMstrings();

    document.querySelector(DOM.addBtn).addEventListener("click", function() {
      ctrlAddItem();
    });

    document.addEventListener("keypress", function(event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });

    document
      .querySelector(DOM.inputType)
      .addEventListener("change", uiController.changeType);

    document
      .querySelector(DOM.containerDiv)
      .addEventListener("click", function(event) {
        var id = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (id) {
          var arr = id.split("-");
          type = arr[0];
          itemId = parseInt(arr[1]);
        }

        //Санхүүгийн контроллероос устгана
        financeController.deleteItem(type, itemId);

        //Дэлгэцнээс устгана.
        uiController.deleteListItem(id);

        //Үлдэгдэл тооцоог хийнэ.
        updateTusuv();
      });
  };

  return {
    init: function() {
      console.log("Application started...");
      uiController.displayMonth();
      uiController.tusviigDelgetsruu({
        tusuv: 0,
        huvi: 0,
        totalInc: 0,
        totalExp: 0
      });
      setupEventListeners();
    }
  };
})(uiController, financeController);

appController.init();
