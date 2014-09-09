app.controller("ActionCtrl", function($scope, $stateParams, $http, Documentation, RequestSender) {
  $scope.controllerName = $stateParams.controller;
  $scope.actionName = $stateParams.action;
  $scope.apiVersion = $stateParams.version;

  Documentation.getController($stateParams.version, $stateParams.controller).then(function(response) {
    $scope.action = _.find(response.data.actions, function(action) { return action.name === $scope.actionName; });
    if (!$scope.action) {
      $scope.error = true;
      return;
    }

    // Extract the example and attach it to each attribute
    _.forEach(['headers', 'params', 'payload'], function(n) {
      var set = $scope.action[n];
      if (set) {
        _.forEach(set.type.attributes, function(attribute, name) {
          var example = set.example ? JSON.stringify(set.example[name], null, 2) : '';
          if (!attribute.options) attribute.options = {};
          if (example) attribute.options.example = example;
          if (attribute.values) {
            attribute.options.values = attribute.values;
            attribute.value = attribute.values[0];
          }
          if (attribute.default) attribute.options.default = attribute.default;
        });
      }
    });

    $scope.responses = [];
    _.forEach($scope.action.responses, function(response, name) {
      response.name = name;
      response.options = {
        headers: response.headers
      }
      $scope.responses.push(response);

      if(response.parts_like) {
        response.parts_like.isMultipart = true;
        response.parts_like.options = {
          headers: response.parts_like.headers
        }
        $scope.responses.push(response.parts_like);
      }
    });

  }, function() {
    $scope.error = true;
  })

  $scope.hasResponses = function() {
    return $scope.action ? _.any($scope.action.responses) : false;
  };

  $scope.sendRequest = function() {
    var url = $scope.action.urls[0].path;

    var headers = RequestSender.parseHeaders($scope.action);
    var params = RequestSender.parseParams($scope.action);
    var payload = RequestSender.parsePayload($scope.action);

    var urlReplacements = url.match(/\:[^\/]+/g);
    _.each(urlReplacements, function(r) {
      var key = r.substring(1);
      url = url.replace(r, params[key]);
      delete params[key];
    });
    $scope.requestUrl = url;

    handleResponse = function(data, status, headers, config) {
      $scope.response = {
        status: status,
        headers: headers(),
        body: data,
      }
    };

    $http({
      method: $scope.action.urls[0].verb,
      url: 'http://localhost:9292' + url,
      params: params,
      headers: headers,
      data: payload
    }).success(handleResponse).error(handleResponse);
  }
});
