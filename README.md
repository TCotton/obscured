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

## Why you should use obscured

Sensitive data like API keys, passwords, tokens, and personal information can easily leak into logs, error messages, or debugging output. The `obscured` library provides a simple wrapper that prevents accidental exposure while still allowing programmatic access when needed.

**Common scenarios:**
- Logging objects that contain API keys or passwords
- Debugging applications with sensitive configuration
- Preventing secrets from appearing in error tracking systems
- Ensuring compliance with data protection requirements
- Protecting user PII in development environments

**Important:** This library prevents *accidental* exposure only. It does not provide cryptographic security or protect against intentional access to memory.

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

## API

### `obscured.make<T>(value: T): Obscured<T>`

Wraps a value in an obscured container.

**Parameters:**
- `value` - The sensitive value to protect

**Returns:** An obscured wrapper that hides the value from serialization

**Example:**
```typescript
const password = obscured.make('my-password-123');
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

## Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run lint` - Check code with Biome
- `npm run lint:fix` - Fix lint issues with Biome
- `npm run format` - Format code with Biome

## License

MIT