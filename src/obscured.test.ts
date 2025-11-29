import { describe, expect, it } from "vitest";
import { obscured, obscureKeys } from "./obscured.js";

describe("obscured", () => {
	it("should return OBSCURED with using obscured.make", () => {
		const result = obscured.make("testing");
		expect(result.toString()).toBe("[OBSCURED]");
		expect(result.toJSON()).toBe("[OBSCURED]");
		expect(result).toEqual({});
	});
	it("should return the correct value using Obscured.value", () => {
		const result = obscured.make("testing");
		expect(result.toString()).toBe("[OBSCURED]");
		expect(result.toJSON()).toBe("[OBSCURED]");
		expect(result).toEqual({});
		const value = obscured.value(result);
		expect(value).toBe("testing");
	});
	it("should return undefined when calling value on a non-obscured value", () => {
		const result = obscured.value("not obscured" as any);
		expect(result).toBeUndefined();
	});
	it("should return OBSCURED with multiple strings using obscured.make", () => {
		const result1 = obscured.make("testing1");
		const result2 = obscured.make("testing2");
		const result3 = obscured.make("testing3");

		expect(result1.toString()).toBe("[OBSCURED]");
		expect(result1.toJSON()).toBe("[OBSCURED]");
		expect(result1).toEqual({});

		expect(result2.toString()).toBe("[OBSCURED]");
		expect(result2.toJSON()).toBe("[OBSCURED]");
		expect(result2).toEqual({});

		expect(result3.toString()).toBe("[OBSCURED]");
		expect(result3.toJSON()).toBe("[OBSCURED]");
		expect(result3).toEqual({});
	});
	it("should return multiple values using obscured.value", () => {
		const result1 = obscured.make("testing1");
		const result2 = obscured.make("testing2");
		const result3 = obscured.make("testing3");

		expect(result1.toString()).toBe("[OBSCURED]");
		expect(result1.toJSON()).toBe("[OBSCURED]");
		expect(result1).toEqual({});

		expect(result2.toString()).toBe("[OBSCURED]");
		expect(result2.toJSON()).toBe("[OBSCURED]");
		expect(result2).toEqual({});

		expect(result3.toString()).toBe("[OBSCURED]");
		expect(result3.toJSON()).toBe("[OBSCURED]");
		expect(result3).toEqual({});

		const value1 = obscured.value(result1);
		expect(value1).toBe("testing1");

		const value2 = obscured.value(result2);
		expect(value2).toBe("testing2");

		const value3 = obscured.value(result3);
		expect(value3).toBe("testing3");
	});
	it("should return true for isObscured with an obscured value", () => {
		const result4 = obscured.make("testing4");
		const result = obscured.isObscured(result4);
		expect(result).toEqual(true);
	});
	it("should return false for isObscured with a non-obscured value", () => {
		const result5 = obscured.make("testing5");
		const value5 = obscured.value(result5);
		const result = obscured.isObscured(value5);
		expect(result).toEqual(false);
	});
});

describe("obscured.objectKeys", () => {
	it("should obscure specified keys in an object", () => {
		const obj = {
			username: "john_doe",
			password: "secret123",
			email: "john@example.com",
		};

		const result = obscured.obscureKeys(obj, ["password"] as const);

		expect(result.username).toBe("john_doe");
		expect(result.email).toBe("john@example.com");
		expect(result.password.toString()).toBe("[OBSCURED]");
		expect(result.password.toJSON()).toBe("[OBSCURED]");
		expect(obscured.isObscured(result.password)).toBe(true);
	});

	it("should obscure multiple keys in an object", () => {
		const obj = {
			apiKey: "key123",
			apiSecret: "secret456",
			username: "admin",
		};

		const result = obscured.obscureKeys(obj, ["apiKey", "apiSecret"] as const);

		expect(result.username).toBe("admin");
		expect(result.apiKey.toString()).toBe("[OBSCURED]");
		expect(result.apiSecret.toString()).toBe("[OBSCURED]");
		expect(obscured.isObscured(result.apiKey)).toBe(true);
		expect(obscured.isObscured(result.apiSecret)).toBe(true);
	});

	it("should retrieve obscured values using obscured.value", () => {
		const obj = {
			token: "bearer-token-xyz",
			userId: "12345",
		};

		const result = obscured.obscureKeys(obj, ["token"] as const);

		expect(result.userId).toBe("12345");
		expect(result.token.toString()).toBe("[OBSCURED]");

		const tokenValue = obscured.value(result.token);
		expect(tokenValue).toBe("bearer-token-xyz");
	});

	it("should handle empty keys array", () => {
		const obj = {
			username: "test",
			password: "pass",
		};

		const result = obscured.obscureKeys(obj, [] as const);

		expect(result.username).toBe("test");
		expect(result.password).toBe("pass");
	});

	it("should not modify original object", () => {
		const obj = {
			secret: "original",
			public: "data",
		};

		const result = obscured.obscureKeys(obj, ["secret"] as const);

		expect(obj.secret).toBe("original");
		expect(obj.public).toBe("data");
		expect(result.secret.toString()).toBe("[OBSCURED]");
	});

	it("should obscure nested object values", () => {
		const obj = {
			config: {
				apiKey: "nested-key",
			},
			name: "app",
		};

		const result = obscured.obscureKeys(obj, ["config"] as const);

		expect(result.name).toBe("app");
		expect(result.config.toString()).toBe("[OBSCURED]");

		const configValue = obscured.value(result.config);
		expect(configValue).toEqual({ apiKey: "nested-key" });
	});
});
