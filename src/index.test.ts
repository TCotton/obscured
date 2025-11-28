import { describe, expect, it } from "vitest";
import { testingFunction } from "./index.js";

describe("testingFunction", () => {
	it('should return "testing"', () => {
		const result = testingFunction();
		expect(result).toBe("testing");
	});
});
