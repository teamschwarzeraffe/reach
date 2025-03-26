import {
  return200WithObject,
  return201,
  return204,
  return500,
} from "@services/return-types";
import type { APIRoute } from "astro";

export async function GET(context) {
  return return200WithObject({ hello: "cruel world" });
}

export var POST: APIRoute = async ({ request }) => {
  let body;
  try {
    body = await request.json();
  } catch (error) {
    return return500("Invalid JSON body");
  }
  return return201("Valid JSON body");
};

export var DELETE: APIRoute = ({ request }) => {
  return return204();
};

export var ALL: APIRoute = ({ request }) => {
  return return200WithObject({ message: "wildcard" });
};
