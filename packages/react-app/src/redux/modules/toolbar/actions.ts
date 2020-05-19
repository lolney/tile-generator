export const SET_IP_REQUESTS_COUNT = "SET_IP_REQUESTS_COUNT";
export const SET_IP_REQUESTS_TOTAL = "SET_IP_REQUESTS_TOTAL";
export const SET_GLOBAL_REQUEST_COUNT = "SET_GLOBAL_REQUEST_COUNT";
export const SET_GLOBAL_REQUEST_TOTAL = "SET_GLOBAL_REQUEST_TOTAL";

export const setIpRequestsCount = (total: number) => ({
  payload: total,
  type: SET_IP_REQUESTS_COUNT,
});

export const setIpRequestsTotal = (total: number) => ({
  payload: total,
  type: SET_IP_REQUESTS_TOTAL,
});

export const setGlobalRequestsTotal = (total: number) => ({
  payload: total,
  type: SET_GLOBAL_REQUEST_COUNT,
});

export const setGlobalRequestsCount = (total: number) => ({
  payload: total,
  type: SET_GLOBAL_REQUEST_TOTAL,
});
