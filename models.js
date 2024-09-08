// models.js
const orm = require('orm');
const moment = require('moment');

module.exports = function (db, cb) {
  const User = db.define("users", {
    id: { type: "serial", key: true },
    email: { type: "text", unique: true },
    password: { type: "text" }
  });

  const Pad = db.define("pads", {
    id: { type: "serial", key: true },
    name: { type: "text" }
  });
  Pad.hasOne("user", User, { required: true });

  const Note = db.define("notes", {
    id: { type: "serial", key: true },
    name: { type: "text" },
    text: { type: "text" },
    created_at: { type: "date", time: true, default: () => new Date() },
    updated_at: { type: "date", time: true, default: () => new Date() }
  });
  Note.hasOne("user", User, { required: true });
  Note.hasOne("pad", Pad);

  return cb();
};

