exports.createDraft = function (obj) {
  return JSON.parse(JSON.stringify(obj));
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
