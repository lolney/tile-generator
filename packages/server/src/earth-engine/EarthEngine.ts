// @ts-ignore: noImplicitAny
import ee from "@google/earthengine";
import privateKey from "../tile-generator-private-key.json";

export default class EarthEngine {
  static async init() {
    await new Promise((resolve, reject) => {
      ee.data.authenticateViaPrivateKey(
        privateKey,
        () => {
          console.log("auth succeeded");
          resolve();
        },
        function (e: Error) {
          reject(e);
        }
      );
    });

    await new Promise((resolve, reject) => {
      ee.initialize(
        null,
        null,
        () => {
          resolve();
        },
        (e: Error) => {
          reject(e);
        }
      );
    });

    return new EarthEngine();
  }
}
