
'use strict';

/* Components */

angular.module('myApp.components', []).
  component('login', {
    templateUrl: "js/partials/login.html",
    controller: function() {
      this.greeting = 'hello';

      this.toggleGreeting = function() {
        this.greeting = (this.greeting == 'hello') ? 'whats up' : 'hello'
      }
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
