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
.config(function($stateProvider) {
  var states = [
    {
      name: 'login',
      url: '',
      template: '<login></login>'
    },
    {
      name: 'app',
      url: '/app',
      template: '<app></app>'
    }
  ];
  states.forEach(function(state) {
    console.log(state);
    $stateProvider.state(state);
  });
});
