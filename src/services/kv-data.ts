import { getD1DataByTable, insertD1Data } from "./d1-data";
import { getRecords, insertRecord } from "./data";
import { kvGetAll } from "./kv";
import TimeAgo from "javascript-time-ago";

// English.
import en from "javascript-time-ago/locale/en";

TimeAgo.addDefaultLocale(en);

// Create formatter (English).
let timeAgo = new TimeAgo("en-US");

export let getAdminKvData = async (context) => {
  try {
    let cacheRequests = await getD1DataByTable(
      context.locals.runtime.env.D1,
      "cacheRequests",
      {}
    );

    let kvRecords = await kvGetAll(context);

    let cacheRequestsCount = cacheRequests.length;
    let kvRecordsCount = kvRecords.length;

    let data = cacheRequests.map((item) => {
      item.url = item.url;
      item.createdOnAgo = timeAgo.format(new Date(item.createdOn));
      item.updatedOnAgo = timeAgo.format(new Date(item.updatedOn));

      let matchingKvRecord = kvRecords.find(
        (record) => record.name === item.url
      );
      if (matchingKvRecord) {
        item.matchingKvRecord = true;
        item.kvUpdatedOnAgo = timeAgo.format(matchingKvRecord.metadata.updatedOn);
      } else {
        item.matchingKvRecord = false;
      }

      return item;
    });

    return {
      cacheRequests: cacheRequests,
      kvRecords: kvRecords,
      cacheRequestsCount: cacheRequestsCount,
      kvRecordsCount: kvRecordsCount,
      data: data,
    };
  } catch (error) {
    console.error(error);
  }
};

export let cacheRequestInsert = async (context, d1, kv, url) => {
  try {
    let data = { url: url };
    insertD1Data(d1, kv, "cacheRequests", data);
  } catch (error) {
    console.error(error);
  }
};

export let purgeKvData = async (context) => {};
