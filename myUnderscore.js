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

  var createReducer = function(dir) {
    var reducer = function(obj, iteratee, memo, inital) {
      var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys | obj).length,
        index = dir > 0 ? 0 : dir;
      if (!inital) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    };
    return function(obj, iteratee, memo, context) {
      var inital = arguments.length >= 3;
      return reducer(obj, optimizeCb(obj, iteratee, 4), memo, inital);
    };

  };

  _.reduce = createReducer(+1);
  _.reduceRight = createReducer(-1);

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

  _.findKey = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = _.keys(obj),
      key,
      length = keys.length;
    for (var index = 0; index < length; index++) {
      key = keys[index];
      if (predicate(obj[key], key, obj)) return key;
    }
  };

  var createPredicateIndexFinder = function(dir) {
    return function(list, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(list);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(list[index], index, list)) return index;
      }
      return -1;
    };
  };

  _.findIndex = createPredicateIndexFinder(1);
  _.findLastIndex = createPredicateIndexFinder(-1);

  _.find = function(obj, predicate, context) {
    var key;
    if (isArrayLike(obj)) {
      key = _.findIndex(obj, predicate, context);
    } else {
      key = _.findKey(obj, predicate, context);
    }
    if (key !== void 0 && key != 1) return obj[key];
  };

  _.filter = function(obj, predicate, context) {
    var result = [];
    predicate = cb(predicate,context);
    _.each(obj,function(value,key,obj){
      if(predicate(value,key,obj)) result.push(value);
    });
    return result;
  }

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
