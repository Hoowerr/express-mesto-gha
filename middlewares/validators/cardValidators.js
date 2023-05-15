const { Joi, celebrate } = require('celebrate');
const { WEB_PATTERN } = require('../../utils/constants');

module.exports.cardDataValidate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().regex(WEB_PATTERN).required(),
  }),
});
module.exports.cardIdValidate = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required(),
  }),
});
