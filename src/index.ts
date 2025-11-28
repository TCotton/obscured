export const testingFunction = () => "testing";

const INSPECT_SYMBOL = Symbol.for("nodejs.util.inspect.custom");
// biome-ignore lint/suspicious/noExplicitAny: WeakMap requires type flexibility for generic storage
const privateValues = new WeakMap<ObscuredImpl<any>, any>();

class ObscuredImpl<T> {
	static readonly PLACEHOLDER = "[OBSCURED]";
	constructor(value: T) {
		privateValues.set(this, value);
	}
	static redact<T>(value: T): ObscuredImpl<T> {
		return new ObscuredImpl(value);
	}
	get(): T {
		const value = privateValues.get(this);

		if (value === undefined) {
			throw new Error("Cannot get value of obscured value");
		}
		return value;
	}
	toString(): string {
		return ObscuredImpl.PLACEHOLDER;
	}
	toJSON(): string {
		return ObscuredImpl.PLACEHOLDER;
	}
	[INSPECT_SYMBOL](): string {
		return ObscuredImpl.PLACEHOLDER;
	}
}

export function obscure<T>(value: T): ObscuredImpl<T> {
	return ObscuredImpl.redact(value);
}

export function value<T>(obscured: ObscuredImpl<T>): T {
	return obscured.get();
}

export function isRedacted(value: unknown): value is ObscuredImpl<unknown> {
	return value instanceof ObscuredImpl;
}
