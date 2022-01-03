import { checker } from "../../src/utils/cors-helper";

describe("CORS util", () => {
  it("If no origin provided return empty array", () => {
    const origin: string[] = [""];
    expect(origin.filter(checker)).toEqual([]);
  });

  it("If origin provided does not contain allowed values return empty array", () => {
    const origin: string[] = ["https://testing.123"];
    expect(origin.filter(checker)).toEqual([]);
  });

  it("If origin provided is one of the allowed return origin value", () => {
    const origin: string[] = ["https://newrelic.com"];
    expect(origin.filter(checker)).toEqual(["https://newrelic.com"]);
  });
});
