'use strict';

// Declare app level module which depends on filters, and services

angular.module('myApp', [
  'ui.router',
  'ui.tinymce',
  'myApp.controllers',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.components'
])
.config(function($stateProvider, $httpProvider) {

  // Check if the user is connected
    //================================================
  var checkLoggedin = function($q, $timeout, $http, $state, $rootScope){
    // Initialize a new promise

    // Make an AJAX call to check if the user is logged in
    $http.get('/loggedin')
      .then(function(user) {
        // Authenticated
        console.log('user');
        console.log(user.data);
        if (user.data != '0')
          /*$timeout(deferred.resolve, 0);*/
          return;

        // Not Authenticated
        else {
          $rootScope.message = 'You need to log in.';
          $state.go('login');
          return;
        }
      },function(error) {
          console.log(error);
          $rootScope.message = 'Error logging in';
          $state.go('signup');
          return;
      });

  };

  var states = [
    {
      name: 'signup',
      url: '',
      template: '<signup></signup>'
    },
    {
      name: 'login',
      url: '/login',
      template: '<login></login>'
    },
    {
      name: 'app',
      url: '/app',
      template: '<app></app>',
      resolve: {
        loggedin: checkLoggedin
      }
    }
  ];

  states.forEach(function(state) {
    $stateProvider.state(state);
  });
});
