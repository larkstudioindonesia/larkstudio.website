# Designer asset workflow

Never edit anything under `public/images/projects/` directly — it is
generated output, overwritten on every run.

For each project, place exactly five renders here:

```
assets/projects/<project-slug>/
  01.jpg   ← hero
  02.jpg   ← gallery
  03.jpg   ← gallery
  04.jpg   ← gallery
  05.jpg   ← gallery
```

`<project-slug>` must match the slug already used in
`content/projects/<slug>.ts`.

Then run:

```bash
npm run generate-assets
```

This crops both required ratios (3:2 and 4:5) out of each render,
writes them to `public/images/projects/<slug>/` under the filenames
the site expects, updates the declared width/height in
`content/projects/*.ts`, and runs the asset audit and production
build.

Don't rename, resize, or manually crop anything — the pipeline does
all of it. If a source image is too small to produce the required
resolution at the required ratio, the run will report exactly which
image and why, rather than silently upscaling or stretching it.

If you've decided a lower-resolution source is acceptable anyway, run
`npm run generate-assets -- --allow-upscale` — this enlarges anything
too small to hit its target instead of skipping it. It is never the
default, and every enlarged file is called out by name with its scale
factor in the report so it can't end up in production unnoticed.
