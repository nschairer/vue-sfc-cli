# vue-sfc-cli
Vue SFC Rapid Iteration CLI Tool

This CLI tool allows developers to rapidly iterate Vue SFC (Single File Component) components using Vite and Hot Module Replacement (HMR). It starts a local development server that serves a single .vue component.

## Installation

To use this CLI tool, first install it globally using npm:

npm install -g xxx

## Usage

```
vue-sfc-cli [--api <host>] <component>
vsc [--api <host>] <component>
```

- --api <host> (optional): Specify a host to forward requests to when hitting /api on the frontend.
- <component>: The path to the .vue component you want to serve.

## Example:

```
vue-sfc-cli --api http://localhost:8080/api my-component.vue
```

This will start a development server at http://localhost:3000 that serves the my-component.vue file with HMR enabled. If the /api endpoint is accessed, it will be forwarded to http://localhost:8080/api.

## License

This project is licensed under the MIT License (LICENSE).
