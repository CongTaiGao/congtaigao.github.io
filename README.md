# Po

A personal portfolio and security blog based on [Mizuki](https://github.com/matsuzaka-yuki/Mizuki), built with Astro. It includes Home, Write-ups, About, Projects, and AI Tools.

## Run locally

Use Node.js 24 and pnpm 11.5.3.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Run `pnpm build` to produce the static site in `dist/` and `pnpm preview` to serve it locally.
If the site is already built, you can also serve it with `python -m http.server 4321 --directory dist`.

## Deploy to GitHub Pages

Set the repository's GitHub Pages source to **GitHub Actions** in Settings → Pages. Push to `main` to build and deploy the site. The deployment workflow is `.github/workflows/deploy.yml`.

## Update the portfolio

- Add posts to `src/content/posts/`.
- Edit the profile and navigation in `src/config/`.
- Edit the About page in `src/content/spec/about.md`.
- Edit the Projects and AI Tools lists in `src/data/`.

Mizuki’s licenses and third-party notices are included in this repository. This adaptation uses Po's avatar and a custom abstract banner in place of the template's demo artwork.
