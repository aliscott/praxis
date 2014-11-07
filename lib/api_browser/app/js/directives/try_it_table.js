app.directive('rsTryItTable', function(RequestSender, $http) {
  return {
    restrict: 'E',
    templateUrl: 'views/directives/try_it_table.html',
    controller: function(){},
    scope: {
      action: '='
    },
    link: function(scope, element) {
      if (scope.action.payload) {
        scope.action.payload.value = "{\n  \n}";
      }

      scope.sendRequest = function() {
        var url = scope.action.urls[0].path.string;

        var headers, params, payload;

        headers = RequestSender.parseHeaders(scope.action);
        params = RequestSender.parseParams(scope.action);
        if (scope.action.payload) {
          payload = scope.action.payload.value;
        } else {
          payload = '';
        }

        var urlReplacements = url.match(/\:\w+/g);
        _.each(urlReplacements, function(r) {
          var key = r.substring(1);
          url = url.replace(r, params[key]);
          delete params[key];
        });
        scope.requestUrl = url;

        handleResponse = function(data, status, headers, config) {
          scope.response = {
            status: status,
            headers: headers(),
            body: data,
          }
        };

        $http({
          method: scope.action.urls[0].verb,
          url: 'http://localhost:9292' + url,
          params: params,
          headers: headers,
          data: payload
        }).success(handleResponse).error(handleResponse);
      }
    }
  };
});
