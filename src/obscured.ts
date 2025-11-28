const INSPECT_SYMBOL = Symbol.for("nodejs.util.inspect.custom");
// biome-ignore lint/suspicious/noExplicitAny: WeakMap requires type flexibility for generic storage
const registry = new WeakMap<Obscured<any>, any>();

/**
 * Represents a value intentionally obscured to prevent accidental exposure
 * via stringification, JSON serialization, or inspection (e.g., in logs or debugging tools).
 *
 * Usage:
 *   - To obscure a sensitive value, use `Obscured.obscure(value)` or `obscured.make(value)`.
 *   - To retrieve the original value, use `obscured.value(obscuredInstance)`.
 *
 * Security considerations:
 *   - This class prevents accidental exposure of sensitive values, but does not provide
 *     cryptographic protection. The value remains accessible in memory and can be retrieved
 *     programmatically.
 *   - Do not rely on this class for secure secret management or to prevent deliberate access.
 *   - Use in conjunction with other security best practices for handling secrets.
 */

export class Obscured<T> {
	static readonly PLACEHOLDER = "[OBSCURED]";

	constructor(value: T) {
		registry.set(this, value);
	}
	static obscure<T>(value: T): Obscured<T> {
		return new Obscured(value);
	}
	toString(): string {
		return Obscured.PLACEHOLDER;
	}
	toJSON(): string {
		return Obscured.PLACEHOLDER;
	}
	[INSPECT_SYMBOL](): string {
		return Obscured.PLACEHOLDER;
	}
}

const make = <T>(value: T) => {
	return Obscured.obscure(value);
};

const value = <T>(obscured: Obscured<T>):T  => {
	return registry.get(obscured) as T;
};

const isObscured = (value: unknown): value is Obscured<unknown> =>
	value instanceof Obscured;

/**
 * Utilities for creating and accessing obscured values.
 * Obscured values hide sensitive data from serialization/logging while
 * allowing controlled access to the underlying value.
 *
 * @example
 * ```ts
 * const secret = obscured.make('api-key-123');
 * console.log(secret);        // '[OBSCURED]'
 * JSON.stringify(secret);     // '"[OBSCURED]"'
 * obscured.value(secret);     // 'api-key-123'
 * obscured.isObscured(secret); // true
 * ```
 */
export const obscured = {
	/**
	 * Wraps a value in an obscured container.
	 * @template T - The type of value to obscure
	 * @param value - The sensitive value to protect
	 * @returns An obscured wrapper that hides the value from serialization
	 */
	make,
	/**
	 * Extracts the underlying value from an obscured container.
	 * @template T - The type of the obscured value
	 * @param obscured - The obscured container
	 * @returns The original unwrapped value
	 */
	value,
	/**
	 * Checks if a value is an obscured instance.
	 * @param value - The value to check
	 * @returns True if the value is obscured, false otherwise
	 */
	isObscured,
};
