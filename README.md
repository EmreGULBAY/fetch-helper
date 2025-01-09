# Generic Fetch

A TypeScript utility for making HTTP requests with both Promise and RxJS Observable support.

## Installation

```bash
npm install @travelaps/fetch-helper
```

## Usage

```typescript
import { sendFetchRequest } from "@travelaps/fetch-helper";

// Promise-based usage
const data = await sendFetchRequest({
  url: "https://jsonplaceholder.typicode.com/posts",
  type: FetchRequestType.GET,
});

// Observable-based usage
const data = sendFetchRequestObs({
  url: "https://jsonplaceholder.typicode.com/posts",
  type: FetchRequestType.GET,
})
  .pipe(
    map((data) => {
      console.log(data);
    })
  )
  .subscribe();
```

## Features

- Support for all HTTP methods (GET, POST, PUT, DELETE)
- Automatic response type handling based on Content-Type headers
- RxJS Observable support
- Query parameter support
- Custom headers support
- TypeScript support with full type definitions

## License

MIT