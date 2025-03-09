
---

# Code Connect

Code Connect is a project written in TypeScript. This repository contains the codebase for the application.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

## Features

- Utilizes [Next.js](https://nextjs.org) for server-side rendering and static site generation.
- Includes a variety of UI components from [Radix UI](https://www.radix-ui.com/).
- Supports real-time collaborative editing with [Socket.io](https://socket.io/).
- Syntax highlighting and code editing using [CodeMirror](https://codemirror.net/) and [Monaco Editor](https://microsoft.github.io/monaco-editor/).
- Animated interactions with [Framer Motion](https://www.framer.com/motion/).

## Installation

To get started with the project, clone the repository and install the dependencies:

```sh
git clone https://github.com/samarthsinh2660/code-connect.git
cd code-connect
npm install
```

## Usage

To run the development server, use the following command:

```sh
npm run dev
```

Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to see the application in action.

## Environment Variables

Create a `.env` file in the root of the project and add the following environment variables:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your-clerk-publishable-key>
CLERK_SECRET_KEY=<your-clerk-secret-key>
```

Replace `<your-clerk-publishable-key>` and `<your-clerk-secret-key>` with the appropriate values.

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Create a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

---

Feel free to modify this template to better suit the needs of your project.
