export let GET = async (context) => {
  let { request } = context;
  //   let { url } = request;
  let url = "test";

  let cache = context.locals.runtime.caches.default;

  let cacheFound = false;
  let cacheResponse = await cache.match(url);
  if (cacheResponse) {
    console.log("Cache hit");
    cacheFound = true;

    return new Response(
        JSON.stringify(cacheResponse),
        { status: 200 }
      );
      
  } else {
    console.log("Cache miss");
  }

  var response = new Response(
    JSON.stringify({
      message: "Cache test: " + cacheFound,
    }),
    { status: 200 }
  );
  response.headers.set("cache-control", "public, max-age=600000");
  response.headers.set("content-type", "application/json");

  try {
    await cache.put(
      url,
      JSON.stringify({ "date:": new Date().toLocaleDateString() })
    );
    console.log("Cache put success?");
  } catch (error) {
    console.log("Cache put error", error);
  }

  return response;
};
