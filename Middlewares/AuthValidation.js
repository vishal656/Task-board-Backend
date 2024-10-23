const Joi = require('joi');

const signupValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(4).max(100).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required()
      .messages({ 'any.only': 'Passwords do not match' })
  }).with('password', 'confirmPassword');

  const { error, value } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({ message: 'Bad request', error });
  }

  const { confirmPassword, ...validatedData } = value;
  req.body = validatedData;

  next();
};

const loginValidation = (req,res,next)=>{
    const schema = Joi.object({
       email: Joi.string().email().required(),
       password: Joi.string().min(4).max(100).required(),
    });
    const {error}=schema.validate(req.body);
    if(error){
        return res.status(400).json({message: "Bad request",error});
    }
    next();
}

module.exports = {signupValidation, loginValidation};