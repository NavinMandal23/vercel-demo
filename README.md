# Field Notes

A small Next.js app for a Vercel demo.

- The home page renders a daily prompt on the server, using the date in Asia/Kolkata.
- `GET /api/prompt` returns that same prompt as JSON.
- Tasks are saved in the browser with `localStorage`. No database or environment variables are required.

## Local

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy

Import this repository in Vercel and use the Next.js preset. The app builds with `npm run build` and does not need extra configuration.
