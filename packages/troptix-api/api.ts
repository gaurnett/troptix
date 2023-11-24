export const prodUrl = process.env.NEXT_PUBLIC_VERCEL_URL;

export class TropTixResponse {
  response: any;
  error: any;

  constructor() {
    this.response = undefined;
    this.error = undefined;
  }
}
