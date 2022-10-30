import expressValidator from "express-validator";

const { body } = expressValidator;

export const defaultAuthValidations = [
    body('email').isEmail(),
    body('password').isLength({ min: 2 }),
]

export const registerValidation = [
    ...defaultAuthValidations,
    body('name').isLength({ min: 2 }),
];
