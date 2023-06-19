var nodeTodo = angular.module("nodeTodo", []);

function mainController($scope, $http) {
  $scope.formData = {};
  $scope.todos = [];
  $scope.cos = "Ala";
  $scope.currentTab = "all";
  $scope.isAllTab = true;
  $scope.isTodoTab = false;
  $scope.isDoneTab = false;

  // when landing on the page, get all todos and show them
  $http
    .get("/api/todos")
    .success(function (data) {
      $scope.todos = data;
    })
    .error(function (data) {
      console.log("Error: " + data);
    });

  // when submitting the add form, send the text to the node API
  $scope.createTodo = function () {
    $http
      .post("/api/todos", $scope.formData)
      .success(function (data) {
        document.getElementById("newTodo").value = "";
        $scope.todos = data;
        $scope.getFilteredTodos($scope.currentTab);
      })
      .error(function (data) {
        console.log("Error: " + data);
      });
  };

  // update a todo after checking it
  $scope.updateTodo = function (id, done) {
    $http
      .post("/api/todos/done/" + id, { done })
      .success(function (data) {
        $scope.todos = data;
        $scope.getFilteredTodos($scope.currentTab);
      })
      .error(function (data) {
        console.log("Error: " + data);
      });
  };

  // delete a todo
  $scope.deleteTodo = function (id) {
    $http
      .delete("/api/todos/" + id)
      .success(function (data) {
        $scope.todos = data;
      })
      .error(function (data) {
        console.log("Error: " + data);
      });
  };

  $scope.updateScopeTabBooleans = function (tab) {
    $scope.currentTab = tab;
    switch (tab) {
      default:
      case "all": {
        $scope.isAllTab = true;
        $scope.isTodoTab = false;
        $scope.isDoneTab = false;
        break;
      }
      case "todo": {
        $scope.isAllTab = false;
        $scope.isTodoTab = true;
        $scope.isDoneTab = false;
        break;
      }
      case "done": {
        $scope.isAllTab = false;
        $scope.isTodoTab = false;
        $scope.isDoneTab = true;
        break;
      }
    }
  };

  // show done todos
  $scope.getFilteredTodos = function (tab) {
    console.log("tab: ", tab);
    $scope.updateScopeTabBooleans(tab);

    // get all todos and filter
    $http
      .get("/api/todos")
      .success(function (data) {
        if (tab === "done") {
          $scope.todos = data.filter(todo => todo.done);
        } else if (tab === "todo") {
          $scope.todos = data.filter(todo => !todo.done);
        } else {
          $scope.todos = data;
        }
      })
      .error(function (data) {
        console.log("Error: " + data);
      });
  };

  // show not done todos
  $scope.showTodosNotDone = function () {
    $scope.todos = $scope.todos.filter(todo => !todo.done);
  };
}
