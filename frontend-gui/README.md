This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## AWS Setup
1. Prolog Team AWS account ID: 585768159841


## AWS Cognito Setup
1. Create a new user pool in AWS Cognito.
2. Create a new app client in the user pool.
3. Add custom attribute 'userType' in User Pool
4. attribute read/write permissions need to be set to 'All'
5. Configure App Client settings:
    - Enable USER_PASSWORD_AUTH flow
    - Add 'custom:userType' to writeable attributes
6. Environment variables needed:
    - AWS_REGION=us-east-1
    - COGNITO_CLIENT_ID= '2o97ajra356tn3c54ho8vb4ggr'
7. Install the required AWS SDK Packages:
```bash
npm install @aws-sdk/client-cognito-identity-provider
```
9. Run the following

npm run dev
# or
npm run build



