const INSPECT_SYMBOL = Symbol.for("nodejs.util.inspect.custom");
// biome-ignore lint/suspicious/noExplicitAny: WeakMap requires type flexibility for generic storage
const registry = new WeakMap<Obscured<any>, any>();

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

const value = <T>(obscured: Obscured<T>): Obscured<T> => {
	return registry.get(obscured);
};

const isObscured = (value: unknown): value is Obscured<unknown> =>
	value instanceof Obscured;

export const obscured = {
	make,
	value,
	isObscured,
};
