export const prodUrl = "https://troptix-alpha.vercel.app";

export class TropTixResponse {
  response: any;
  error: any;

  constructor() {
    this.response = undefined;
    this.error = undefined;
  }
}