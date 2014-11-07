app.directive('rsAttributeInput', function($compile, InputTemplates) {
  return {
    restrict: 'E',
    scope: {
      attribute: '='
    },
    link: function(scope, element, attrs) {
      // use the attribute type name to find the template
      var type = (scope.attribute.type ? scope.attribute.type.name : null) || 'default';

      InputTemplates.resolve(type).then(function(template) {
        element.replaceWith($compile(template)(scope));
      });
    }
  }
});
