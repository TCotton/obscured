import { describe, expect, it } from "vitest";
import { obscured } from "./obscured.js";

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
