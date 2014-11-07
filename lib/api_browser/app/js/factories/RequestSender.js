app.factory('RequestSender', function() {
  function parseAttributes(obj) {
    var attributes;
    if (obj) {
      attributes = _.object(_.map(obj.type.attributes, function(attr, key) {
        return [key, attr.value]
      }));
    }
    return attributes;
  }

  return {
    parseHeaders: function(action) {
      return parseAttributes(action.headers);
    },

    parseParams: function(action) {
      return parseAttributes(action.params);
    },

    parsePayload: function(action) {
      return parseAttributes(action.payload);
    }
  };
});
