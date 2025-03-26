export let return200 = (data = {}) => {
  return new Response(
    JSON.stringify({
      data,
    }),
    { status: 200 }
  );
};

export let return200WithObject = (object) => {
  return new Response(
    JSON.stringify(
      object,
    ),
    { status: 200 }
  );
};

export let return201 = (message = "Record Created") => {
  return new Response(
    JSON.stringify({
      message,
    }),
    { status: 201 }
  );
};

export let return204 = (message = "Record Deleted") => {
  return new Response(
    JSON.stringify({
      message,
    }),
    { status: 201 }
  );
};

export let return400 = (message = "Unauthorized") => {
  return new Response(
    JSON.stringify({
      message,
    }),
    { status: 400 }
  );
};

export let return401 = (message = "Unauthorized") => {
  return new Response(
    JSON.stringify({
      message,
    }),
    { status: 401 }
  );
};

export let return404 = (message = "Not Found") => {
  return new Response(
    JSON.stringify({
      message,
    }),
    { status: 404 }
  );
};

export let return500 = (message = "Internal Server Error") => {
  return new Response(
    JSON.stringify({
      message,
    }),
    { status: 500 }
  );
};
