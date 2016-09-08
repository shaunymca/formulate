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
    var deferred = $q.defer();

    // Make an AJAX call to check if the user is logged in
    $http.get('/loggedin').success(function(user){
      // Authenticated
      if (user !== '0')
        /*$timeout(deferred.resolve, 0);*/
        deferred.resolve();

      // Not Authenticated
      else {
        $rootScope.message = 'You need to log in.';
        //$timeout(function(){deferred.reject();}, 0);
        deferred.reject();
        $state.go('login');
      }
    });

    return deferred.promise;
  };

  // Add an interceptor for AJAX errors
  //================================================
  $httpProvider.interceptors.push(function($q) {
    return {
      response: function(response) {
        // do something on success
        return response;
      },
      responseError: function(response) {
        if (response.status === 401)
          $state.go('login');
        return $q.reject(response);
      }
    };
  });

  var states = [
    {
      name: 'login',
      url: '/',
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
