This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

To run the development server, you must first install node modules 

```bash
npm install
npm run dev
# or
yarn install
yarn dev
# or
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.
```

## Project Structure 

`pages/index.js` is where the form for user input is generated. It uses the `components` directory to generate more complex 
dropdowns.

## TO DO

Currently, assignees for the JIRA ticket are hard-coded as a list inside of `index.js`. This should eventually be abstracted to some other service, or generated from an API call to JIRA.

There is some refactoring that can be done to better improve readibility, maintainability and DRY practices. 

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

