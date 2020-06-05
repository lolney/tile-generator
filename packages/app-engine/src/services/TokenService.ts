import fetch from "node-fetch";

const metadataServerTokenURL =
  "http://metadata/computeMetadata/v1/instance/service-accounts/default/identity?audience=";

const fetchPeriod = 1000 * 60 * 30;

export class TokenService {
  private fetchedAt?: number;
  private token?: string;

  constructor(private receivingServiceUrl: string) {}

  private get tokenUrl() {
    return metadataServerTokenURL + this.receivingServiceUrl;
  }

  private get options() {
    return {
      headers: {
        "Metadata-Flavor": "Google",
      },
    };
  }

  getToken = async () => {
    if (!this.token || Date.now() - this.fetchedAt > fetchPeriod) {
      this.fetchedAt = Date.now();
      const resp = await fetch(this.tokenUrl, this.options);
      this.token = await resp.text();
    }
    return this.token;
  };
}
