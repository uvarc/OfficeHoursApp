This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/](http://localhost:3000/api/).

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

This project requires an env for the following variables:
```bash
LDAP_API_KEY
JIRA_API_KEY
```

## Project Structure

`pages/index.js` is where the form for user input is generated. It uses the `components` directory to generate more complex 
dropdowns.

`pages/api/form.js` is the only API route in this project. It is responsible for taking the user input and generating the 
appropriate JQL query to send to the JIRA API. It also uses the [LDAP API](https://github.com/uvarc/ldap-api) to get the department and school for the visitor. 

## TO DO

Currently, assignees for the JIRA ticket are hard-coded as a list inside of `index.js`. This should eventually be abstracted to some other service, or generated from an API call to JIRA.

There is some refactoring that can be done to better improve readibility, maintainability and DRY practices. 

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

