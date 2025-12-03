jest.mock("@/lib/prisma", () => ({ prisma: {} }));

describe("auth helpers", () => {
  it("creates a signed JWT", async () => {
    process.env.JWT_SECRET = "test-secret";
    const { signAuthToken } = await import("@/lib/auth");
    const token = signAuthToken("user-123");
    expect(token).toContain(".");
  });
});
