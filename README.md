# obscured

A small TypeScript utility library for obscuring important data to prevent accidental exposure in logs. Inspired by Redacted in the [Effect library](https://github.com/Effect-TS/effect).

## Features

- **Automatic String Masking**: Obscured values automatically display as `[OBSCURED]` when converted to strings
- **JSON Serialization Protection**: Prevents sensitive data from appearing in JSON output
- **Console/Debug Protection**: Hides values in Node.js `util.inspect()` and console output
- **Type-Safe**: Full TypeScript support with generic types
- **Lightweight**: Minimal dependencies and small footprint
- **Memory Efficient**: Uses WeakMap for internal storage to allow garbage collection
- **Browser Support**: Works in both Node.js and the browser

## Installation

```bash
npm install obscured
```

## Requirements
- Node.js >= 20.0.0
- Testing on Node versions 20 and 22
- Testing on browser: Chromium headless
- Testing on Bun 1.3.3

## Why you should use obscured

Sensitive data like API keys, passwords, tokens, and personal information can easily leak into logs, error messages, or debugging output. The `obscured` library provides a simple wrapper that prevents accidental exposure while still allowing programmatic access when needed.

**Common scenarios:**
- Logging objects that contain API keys or passwords
- Debugging applications with sensitive configuration
- Preventing secrets from appearing in error tracking systems
- Ensuring compliance with data protection requirements
- Protecting user PII in development environments

**Important:** This library prevents *accidental* exposure only. It does not provide cryptographic security, nor does it protect against intentional or deliberate access to memory. Do not rely on this library for secure secret management - always use in conjunction with other security best practices for handling secrets.

## Usage

```typescript
import { obscured } from 'obscured';

const apiKeyValue = process.env.API_KEY;

// Create an obscured value
const apiKey = obscured.make(apiKeyValue);

// Safe to log - shows [OBSCURED]
console.log(apiKey);              // Output: [OBSCURED]
console.log(`API Key: ${apiKey}`); // Output: API Key: [OBSCURED]

// Safe to serialize
JSON.stringify({ key: apiKey });   // Output: {"key":"[OBSCURED]"}

// Retrieve the actual value when needed
const actualKey = obscured.value(apiKey);  // 'secret-api-key-12345'

// Check if a value is obscured
obscured.isObscured(apiKey);      // true
obscured.isObscured('plain text'); // false
```

### Working with Objects

```typescript
import { obscured } from 'obscured';

// Obscure specific keys in an object
const config = {
  database: 'postgres://localhost',
  apiKey: 'secret-key-123',
  apiSecret: 'secret-456',
  username: 'admin'
};

const securedConfig = obscured.obscureKeys(config, ['apiKey', 'apiSecret'] as const);

// Safe logging - sensitive keys are obscured
console.log(securedConfig);
// Output: { database: 'postgres://localhost', apiKey: [OBSCURED], apiSecret: [OBSCURED], username: 'admin' }

// Non-sensitive values remain accessible
console.log(securedConfig.username);  // 'admin'
console.log(securedConfig.database);  // 'postgres://localhost'

// Sensitive values are obscured
console.log(securedConfig.apiKey);    // [OBSCURED]

// Retrieve actual values when needed
const actualKey = obscured.value(securedConfig.apiKey);  // 'secret-key-123'
```

### Import the type
You can also import the branded type if needed:
```typescript
import type { Obscured } from 'obscured';
import { obscured } from 'obscured';

const commerciallySensitiveDataObscured = obscured.make(values.commerciallySensitiveData);

function doSomethingWithCommerciallySensitiveData(data: Obscured<string>): Obscured<string> {
    return data;
}

const config = {
    apiKey: 'secret-key-123',
    apiSecret: 'secret-456',
    username: 'admin'
}
const secured = obscured.obscureKeys(config, ['apiKey', 'apiSecret'] as const)

doSomethingWithCommerciallySensitiveData(secured.apiKey) // TypeScript pass
doSomethingWithCommerciallySensitiveData(secured.username) // TypeScript error (username is not obscured)

```
The above is a contrived example, but it demonstrates how you can use the Obscured type.

## API

### `obscured.make<T extends Primitive>(value: T): Obscured<T>`

Wraps a primitive value in an obscured container. Only accepts primitive types (string, number, boolean, null, undefined, symbol, bigint).

**Important:** This function only accepts primitive values. To obscure object properties, use `obscured.obscureKeys()` instead.

**Parameters:**
- `value` - The sensitive primitive value to protect

**Returns:** An obscured wrapper that hides the value from serialization

**Throws:** `TypeError` if a non-primitive value (object, array, etc.) is provided

**Example:**
```typescript
const password = obscured.make('my-password-123');
const apiToken = obscured.make('token-xyz');
const port = obscured.make(3000);

// This will throw an error:
// obscured.make({ secret: 'value' }); // TypeError: Cannot obscure non-primitive values
```

### `obscured.value<T>(obscured: Obscured<T>): T | undefined`

Extracts the underlying value from an obscured container.

**Parameters:**
- `obscured` - The obscured container

**Returns:** The original unwrapped value, or `undefined` if the value is not an obscured instance

**Example:**
```typescript
const secret = obscured.make('hidden');
const revealed = obscured.value(secret); // 'hidden'

// Returns undefined for non-obscured values
const notObscured = obscured.value('plain string' as any); // undefined
```

### `obscured.isObscured(value: unknown): value is Obscured<unknown>`

Checks if a value is an obscured instance.

**Parameters:**
- `value` - The value to check

**Returns:** `true` if the value is obscured, `false` otherwise

**Example:**
```typescript
const obscuredValue = obscured.make('test');
obscured.isObscured(obscuredValue); // true
obscured.isObscured('plain string'); // false
```

### `obscured.obscureKeys<T, K>(obj: T, keys: readonly K[]): T & { [P in K]: Obscured<T[P]> }`

Obscures specified keys in an object by wrapping their values. Creates a shallow copy of the object with selected properties obscured.

**Parameters:**
- `obj` - The object containing keys to obscure
- `keys` - Array of key names to obscure

**Returns:** A new object with specified keys obscured

**Example:**
```typescript
const config = {
  apiKey: 'secret-key-123',
  apiSecret: 'secret-456',
  username: 'admin'
};

const secured = obscured.obscureKeys(config, ['apiKey', 'apiSecret'] as const);

console.log(secured.username);       // 'admin'
console.log(secured.apiKey);         // [OBSCURED]
console.log(secured.apiSecret);      // [OBSCURED]

// Retrieve original values when needed
const key = obscured.value(secured.apiKey);  // 'secret-key-123'
```

### `obscured.isEquivalent<A, B>(a: Obscured<A>, b: Obscured<B>): boolean`

Checks if two obscured values contain equivalent underlying values. Compares the actual values stored in the registry using strict equality (===).

**Parameters:**
- `a` - The first obscured value to compare
- `b` - The second obscured value to compare

**Returns:** `true` if both obscured values exist in the registry and contain equivalent values, `false` otherwise

**Example:**
```typescript
const secret1 = obscured.make('password123');
const secret2 = obscured.make('password123');
const secret3 = obscured.make('different');

obscured.isEquivalent(secret1, secret2); // true
obscured.isEquivalent(secret1, secret3); // false

// Works with different primitive types
const num1 = obscured.make(42);
const num2 = obscured.make(42);
obscured.isEquivalent(num1, num2); // true
```

## Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run lint` - Check code with Biome
- `npm run lint:fix` - Fix lint issues with Biome
- `npm run format` - Format code with Biome

## License

MIT