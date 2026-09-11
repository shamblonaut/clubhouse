import { matchedData, validationResult } from "express-validator";

export function validateRequest(requestView) {
  return (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      if (requestView) {
        return res.status(400).render(requestView, {
          errors: errors.array().map((error) => error.msg),
        });
      } else {
        return res
          .status(400)
          .json({ errors: errors.array().map((error) => error.msg) });
      }
    }

    req.validatedBody = matchedData(req);
    next();
  };
}
