const INSPECT_SYMBOL = Symbol.for("nodejs.util.inspect.custom");
// biome-ignore lint/suspicious/noExplicitAny: WeakMap requires type flexibility for generic storage
const registry = new WeakMap<Obscured<any>, any>();

declare const ObscuredBrand: unique symbol;

export type Obscured<T> = ObscuredClass<T> & { readonly [ObscuredBrand]: T };

/**
 * Represents a value intentionally obscured to prevent accidental exposure
 * via stringification, JSON serialization, or inspection (e.g., in logs or debugging tools).
 *
 * Usage:
 *   - To obscure a sensitive value, use `Obscured.obscure(value)` or `obscured.make(value)`.
 *   - To retrieve the original value, use `obscured.value(obscuredInstance)`.
 *   - These are the factory functions for creating and accessing obscured values.
 *
 * Security considerations:
 *   - This class prevents accidental exposure of sensitive values, but does not provide
 *     cryptographic protection. The value remains accessible in memory and can be retrieved
 *     programmatically.
 *   - Do not rely on this class for secure secret management or to prevent deliberate access.
 *   - Use in conjunction with other security best practices for handling secrets.
 */

class ObscuredClass<T> {
	static readonly PLACEHOLDER = "[OBSCURED]";
	declare readonly [ObscuredBrand]: T;

	constructor(value: T) {
		registry.set(this, value);
	}
	toString(): string {
		return ObscuredClass.PLACEHOLDER;
	}
	toJSON(): string {
		return ObscuredClass.PLACEHOLDER;
	}
	[INSPECT_SYMBOL](): string {
		return ObscuredClass.PLACEHOLDER;
	}
}

type Primitive = string | number | boolean | null | undefined | symbol | bigint;

/**
 * @function make
 * @description Wraps a value in an obscured container.
 * @template T - The type of value to obscure
 * @param value - The sensitive value to protect
 * @returns An obscured wrapper that hides the value from serialization
 */
const make = <T extends Primitive>(value: T): Obscured<T> => {
	if (typeof value === "object" && value !== null) {
		throw new TypeError(
			"Cannot obscure non-primitive values. Use obscureKeys for objects.",
		);
	}
	return new ObscuredClass(value) as Obscured<T>;
};

/**
 * @function value
 * @description Extracts the underlying value from an obscured container.
 * @template T - The type of the obscured value
 * @param obscured - The obscured container
 * @returns The original unwrapped value
 */
const value = <T>(obscured: Obscured<T>): T | undefined => {
	if (!isObscured(obscured)) {
		return undefined;
	}
	return registry.get(obscured) as T;
};

/**
 * @function isObscured
 * @description Checks if a value is an obscured instance.
 * @param value - The value to check
 * @returns True if the value is obscured, false otherwise
 */
const isObscured = (value: unknown): value is Obscured<unknown> =>
	value instanceof ObscuredClass;

/**
 * @function obscureKeys
 * @description Obscures specified keys in an object by wrapping their values.
 * Creates a shallow copy of the object with selected properties obscured.
 *
 * @template T - The type of the object
 * @template K - The keys to obscure (must be string keys of T)
 * @param obj - The object containing keys to obscure
 * @param keys - Array of key names to obscure
 * @returns A new object with specified keys obscured
 *
 * @example
 * ```ts
 * const config = {
 *   apiKey: 'secret-key-123',
 *   apiSecret: 'secret-456',
 *   username: 'admin'
 * };
 *
 * const secured = obscured.obscureKeys(config, ['apiKey', 'apiSecret']);
 * console.log(secured.username);  // 'admin'
 * console.log(secured.apiKey);    // [OBSCURED]
 * obscured.value(secured.apiKey); // 'secret-key-123'
 * ```
 */
const obscureKeys = <
	T extends Record<string, unknown>,
	K extends keyof T & string,
>(
	obj: T,
	keys: readonly K[],
): T & { [P in K]: Obscured<T[P]> } => {
	// biome-ignore lint/suspicious/noExplicitAny: WeakMap requires type flexibility for generic storage
	const cloned: any = { ...obj };

	for (const key of keys) {
		if (key in cloned) {
			// Allow objects in obscureKeys by directly creating ObscuredClass
			cloned[key] = new ObscuredClass(cloned[key]) as Obscured<T[typeof key]>;
		}
	}

	return cloned;
};

/**
 * @function isEquivalent
 * @description Checks if two obscured values contain equivalent underlying values.
 * Compares the actual values stored in the registry using strict equality (===).
 *
 * @template A - The type of the first obscured value
 * @template B - The type of the second obscured value
 * @param a - The first obscured value to compare
 * @param b - The second obscured value to compare
 * @returns `true` if both obscured values exist in the registry and contain equivalent values, `false` otherwise
 *
 * @example
 * ```ts
 * const secret1 = obscured.make('password123');
 * const secret2 = obscured.make('password123');
 * const secret3 = obscured.make('different');
 *
 * obscured.isEquivalent(secret1, secret2); // true
 * obscured.isEquivalent(secret1, secret3); // false
 *
 * // Works with different types
 * const num1 = obscured.make(42);
 * const num2 = obscured.make(42);
 * obscured.isEquivalent(num1, num2); // true
 *
 * // Object comparison uses reference equality
 * const obj = { key: 'value' };
 * const obj1 = obscured.make(obj);
 * const obj2 = obscured.make(obj);
 * obscured.isEquivalent(obj1, obj2); // true (same reference)
 * ```
 */
const isEquivalent = <A, B>(a: Obscured<A>, b: Obscured<B>): boolean => {
	if (!registry.has(a) || !registry.has(b)) return false;
	return registry.get(a) === registry.get(b);
};

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
 * obscured.isEquivalent(obscured.make('api-key-123'), obscured.make('api-key-456')) // false
 * ```
 */
export const obscured = {
	make,
	value,
	isObscured,
	obscureKeys,
	isEquivalent,
};
