import ee from "@google/earthengine";
import privateKey from "../../../tile-generator-private-key.json";
import isLand from "./isLand.js";

export default class EarthEngine {
  static async init() {
    await new Promise((resolve, reject) => {
      ee.data.authenticateViaPrivateKey(
        privateKey,
        () => {
          console.log("auth succeeded");
          resolve();
        },
        function(e) {
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
        e => {
          reject(e);
        }
      );
    });

    return new EarthEngine();
  }

  parseRequest(req) {
    // Match req -> method
    // Start jobs
    // On all jobs complete: create outputed map
  }

  static async runAnalysis() {
    return new Promise(resolve => {
      var image = new ee.Image("srtm90_v4");
      image.getMap({ min: 0, max: 1000 }, map => {
        console.log(map);
        resolve(map);
      });
    });
  }
}
