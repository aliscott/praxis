app.directive('elastic', ['$timeout', function($timeout) {
  return {
    restrict: 'A',
     link: function($scope, element) {
      var resize = function() {
        return element[0].style.height = '' + element[0].scrollHeight + 'px';
      };
      element.on('blur keyup change', resize);
      $timeout(resize, 0);
    }
  };
}]);
