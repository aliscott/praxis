app.factory('InputTemplates', function($http, $templateCache, TemplateProvider) {

  var defaultTemplate = $http.get('views/directives/attribute_input/_text.html', { cache: $templateCache });

  var localTemplates = {
    "String": $http.get('views/directives/attribute_input/_text.html', { cache: $templateCache }),
    "DateTime": $http.get('views/directives/attribute_input/_datetime.html', { cache: $templateCache })
  };

  return TemplateProvider(defaultTemplate, localTemplates, "embedded");
});
