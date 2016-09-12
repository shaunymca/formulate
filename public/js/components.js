
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
          email: $scope.user.email,
          password: $scope.user.password,
        }).then(function(user) {
            // No error: authentication OK
            $rootScope.message = 'Signup successful!';
            $rootScope.user = user;
            $state.go('app');
          }, function(response) {error(function(){
            console.log(response);
            // Error: authentication failed
            $rootScope.message = 'Singup Failed';
            $state.go('login');
          });
        });
      };
    }
  })
  .component('signup', {
    templateUrl: "js/partials/signup.html",
    controller: function($scope, $http, $rootScope, $state) {
      $scope.user = {};
      // Register the login() function
      $scope.signup = function(){
        $http.post('/signup', {
          email: $scope.user.email,
          password: $scope.user.password,
        }).then(function(user) {
            // No error: authentication OK
            $rootScope.message = 'Signup successful!';
            $rootScope.user = user;
            $state.go('app');
          }, function(response) {error(function(){
            console.log(response);
            // Error: authentication failed
            $rootScope.message = 'Singup Failed';
            $state.go('signup');
          });
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
