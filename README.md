# Valentine Invite Mini Site

A playful, responsive Valentine invite built with Vite + React + TypeScript for static hosting on GitHub Pages.

## Setup

```bash
npm i
npm run dev
```

Production build:

```bash
npm run build
```

## Edit Content and Config

All editable content lives in `src/config.ts`:

- Names (`myName`, `herName`)
- Required picks count (`requiredSelections`)
- Image metadata (`images`)
- Screen message text
- Email values (`myEmail`, `emailSubject`, `emailIntroLine`)
- YES button progression text
- Theme colors

## Add Your Real Photos

Place your real files in `public/us/`, then update `filename` values in `src/config.ts`.

Example:

- file: `public/us/ana-1.jpg`
- config: `{ id: "pic-1", filename: "ana-1.jpg", ... }`

The app includes placeholders and a fallback image so it never crashes if a file is missing.

## CODE Obfuscation / Decode

Final screen generates:

- `CODE: V1-...`

This is a base64url-encoded JSON payload containing selected IDs, labels, and timestamp.

Developer decode helper is in `src/utils/codec.ts`:

- `decodeCode("V1-...")`

## GitHub Pages Deployment

This repo includes `.github/workflows/deploy.yml` using official Pages actions.

### 1) Set Vite base path

In `vite.config.ts`, set:

```ts
base: '/<REPO_NAME>/'
```

For your repo (`rithwikgokhale/V-day`) use:

```ts
base: '/V-day/'
```

### 2) Push to GitHub

Push this project to the `main` branch of your repo.

### 3) Enable Pages

In GitHub repo settings:

- Open **Settings** > **Pages**
- Under **Build and deployment**, select **GitHub Actions**

After the workflow runs, your site deploys automatically on each push to `main`.
