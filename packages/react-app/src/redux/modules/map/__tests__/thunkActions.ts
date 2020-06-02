import { readEventStream } from "../thunkActions";

describe("readEventStream", () => {
  const lines = [
    '{"a":""',
    "}\n",
    '{"a":1}\n{"b":2}\n',
    '{"a":""',
    '}\n{"a":1}\n{"b":2}\n',
    '{"a":""',
    ',"b":2',
    "}\n",
    '{"a":""}\n',
    '{"b":""}\n',
  ];
  const expectedResults = [
    { a: "" },
    { a: 1 },
    { b: 2 },
    { a: "" },
    { a: 1 },
    { b: 2 },
    { a: "", b: 2 },
    { a: "" },
    { b: "" },
  ];

  function* read() {
    for (const line of lines) yield line;
  }
  const generator = read();
  const reader = {
    read: () => {
      const nxt = generator.next();
      if (nxt.done) return { done: true };
      return { value: new TextEncoder().encode(nxt.value) };
    },
  };

  it("should create the final output properly", async () => {
    const spy = jest.spyOn(JSON, "parse");
    await readEventStream(
      (reader as unknown) as ReadableStreamDefaultReader<Uint8Array>
    )(jest.fn());

    expect(spy.mock.results.map((result) => result.value)).toEqual(
      expectedResults
    );
  });
});
