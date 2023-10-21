exports.createDraft = function (obj) {
  return obj;
};

exports.finishDraft = function (obj) {
  return obj;
};

exports.original = function (obj) {
  return obj;
};

exports.produce = function (obj, cb) {
  cb(exports.createDraft(obj));
};

exports.__NATIVE_JS__ = true;
