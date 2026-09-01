const { body, validationResult } = require('express-validator');

const validateRules = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array().map(err => err.msg) });
  }
  next();
};

const signupValidation = [
  body('name')
    .trim()
    .isLength({ min: 20, max: 60 })
    .withMessage('Name must be between 20 and 60 characters'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('A valid email address is required'),
  body('address')
    .trim()
    .isLength({ min: 1, max: 400 })
    .withMessage('Address cannot exceed 400 characters'),
  body('password')
    .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,16}$/)
    .withMessage('Password must be 8-16 chars, include at least 1 uppercase letter and 1 special char'),
  validateRules
];

const passwordUpdateValidation = [
  body('newPassword')
    .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,16}$/)
    .withMessage('New password must be 8-16 chars, with 1 uppercase letter and 1 special char'),
  validateRules
];

module.exports = { signupValidation, passwordUpdateValidation };