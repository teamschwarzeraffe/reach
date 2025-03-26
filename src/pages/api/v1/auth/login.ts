import { login } from "@services/auth";
import { hashString } from "@services/cyrpt";
import {
  return200,
  return200WithObject,
  return401,
  return500,
} from "@services/return-types";
import type { APIRoute } from "astro";

export let POST: APIRoute = async (context) => {

  let contentType = context.request.headers.get("content-type");
  if (context.request.headers.get("content-type") === "application/json") {
    // Get the body of the request
    let body: { email: string; password: string } = await context.request.json();
    let { email, password } = body;

    let loginResult = await login(
      context.locals.runtime.env.D1,
      email,
      password
    ) as { bearer: string; expires: string };

    if (loginResult) {
      return return200WithObject({
        bearer: loginResult.bearer,
        expires: loginResult.expires,
      });
    } else {
      return return401("Error: Invalid email or password");
    }
  }

  return return500("Error: Content-Type must be application/json");
};
