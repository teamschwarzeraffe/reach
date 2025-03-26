import { validateSessionToken } from "./sessions";

export let checkToken = async (context: any) => {
  // get header for token and lookup user and attached to context
  let token = context.request.headers
    .get("Authorization").toLowerCase()
    ?.replace("bearer ", "");
  if (!token) {
    return false;
  }

  try {
    let userSession = await validateSessionToken(
      context.locals.runtime.env.D1,
      token
    );

    if (userSession.user == null || userSession.session == null) {
      return false;
    }

    context.locals.user = userSession.user;
  } catch (error) {
    return false;
  }

  return true;
};
