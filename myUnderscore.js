(function() {
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
  };
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var getLength = property('length');
  var property = function(prop) {
    return function(obj) {
      return obj == null ? void 0 : obj[prop];
    };
  };
  var isArrayLike = function(collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  var objProto = Object.prototype;

  var nativeKeys = Object.keys,
    hasOwnProperty = objProto.hasOwnProperty;

  var optimizeCb = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1:
        return function(value) {
          return func.call(context, value);
        };
      case 3:
        return function(value, index, collection) {
          return func.call(context, value, index, collection);
        };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  var cb = function(value, context, argCount) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    if (_.isObject(value)) return _.matcher(value);
    return _.property(value);
  };

  var createAssigner = function(keysFunc, defaults) {
    return function(obj) {
      var length = arguments.length;
      if (defaults) obj = Object(obj);
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[i],
          keys = keysFunc(source);
        for (var i = 0; i < keys.length; i++) {
          var key = keys[i];
          if (!defaults || obj[key] === void 0) obj[key] = source[key];
        }

      }
    };
  };

  _.matcher = _.matchs = function(attrs) {
    return function(obj) {
      attrs = _.extendOwn({}, attrs);
      return _.isMatch(obj, attrs);
    };
  };

  _.extendOwn = createAssigner(_.keys);

  _.extend = createAssigner(_.allKeys);

  _.defaults = createAssigner(_.allKeys, true);

  _.isMatch = function(obj, attrs) {
    var length = attrs.length,
      keys = _.keys(attrs);
    if (obj == null) return !length;
    for (var i = 0; i < length; i++) {
      var key = keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  };
  _.each = _.foreach = function(obj, iteratee, context) {
    var i, length;
    iteratee = optimizeCb(iteratee, context);
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };
  _.map = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
      length = (keys | obj).length,
      results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      result[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  _.has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  };
  _.keys = function(obj) {
    var keys = [];
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    for (var key in obj) {
      if (_.has(obj, key))
        keys.push(key);
    }
    return keys;
  };

  _.allKeys = function(obj) {
    var keys = [];
    if (!_.isObject(obj)) return [];
    for (var key in obj) {
        keys.push(key);
    }
    return keys;
  };

  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };
  _.isFunction = function(func) {
    return typeof func === 'function';
  };
  _.identity = function(value) {
    return value;
  };

  window._ = _;
})()
