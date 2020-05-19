import {
  setGlobalRequestsCount,
  setGlobalRequestsTotal,
  setIpRequestsCount,
  setIpRequestsTotal,
} from "./actions";

export type Action =
  | ReturnType<typeof setIpRequestsCount>
  | ReturnType<typeof setIpRequestsTotal>
  | ReturnType<typeof setGlobalRequestsTotal>
  | ReturnType<typeof setGlobalRequestsCount>;
