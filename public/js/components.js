
'use strict';

/* Components */

angular.module('myApp.components', []).
  component('login', {
    templateUrl: "js/partials/login.html",
    controller: function($scope, $http, $rootScope, $state) {
      $scope.user = {};
      // Register the login() function
      $scope.login = function(){
        $http.post('/login', {
          username: $scope.user.username,
          password: $scope.user.password,
        })
        .success(function(user){
          // No error: authentication OK
          $rootScope.message = 'Authentication successful!';
          $state.go('app');
        })
        .error(function(){
          // Error: authentication failed
          $rootScope.message = 'Authentication failed.';
          $state.go('login');
        });
      };
    }
  })
  .component('app', {
    templateUrl: "js/partials/editorDirective.html",

    controller: function($scope, $sce) {
      $scope.howto = "Use \"{{}}\" around variables to insert them into text."
      $scope.tinymceModel = '';
      $scope.Math = window.Math;
      $scope.account = {name:"Shaun",
                        age:"32"};
      $scope.getContent = function() {
        $scope.print = $scope.tinymceModel;
        console.log('Editor content:', $scope.tinymceModel);
      };

      $scope.setContent = function() {
        $scope.tinymceModel = 'Time: ' + (new Date());
      };

      $scope.tinymceOptions = {
        plugins: "link image code table",
        toolbar: 'undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image'
      };
    }
  });
