const { check, validationResult } = require("express-validator");

const validatorRules = (routeName) => {
  switch (routeName) {
    case "tasks":
      return [
        check("description", "Please add a task description").not().isEmpty(),
      ];
    case "taskItems":
      return [check("item", "Please add an item description").not().isEmpty()];
    case "users":
      return [
        check("name", "Please add a name").not().isEmpty(),
        check("email", "Please include a valid email").isEmail(),
        check(
          "password",
          "Please enter a password with 6 or more characters"
        ).isLength({ min: 6 }),
      ];
    default:
      break;
  }
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(422).json({
    errors: extractedErrors,
  });
};

module.exports = {
  validatorRules,
  validate,
};
