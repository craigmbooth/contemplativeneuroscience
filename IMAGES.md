# Image Style Guide

How the artwork on each site looks, and how to write Midjourney prompts that match it. When asked for a Midjourney prompt, read the section for the site in question, use the prompt recipe below, and check the result against the "Avoid" list.

This covers the generated artwork: theme paintings, the home-page banner and the logo. Figures inside posts are charts drawn from a paper's numbers or adapted from its figures (see `STYLE.md`), never generated images.

## Where Images Appear, and What That Demands

| Image | File | Size | Shown as |
|---|---|---|---|
| Theme painting | `sites/<name>/public/assets/images/themes/<theme_key>.webp` | 800×800, WebP q80 | 180–250px beside the theme page's heading; the left panel of every share card for the theme and its posts |
| Theme thumbnail | `…/themes/thumbs/<theme_key>.webp` | 240×240, WebP q80 | Home page and Research Themes question cards |
| Home banner | `sites/<name>/public/assets/images/index_header.jpg` | 2048×835, progressive JPEG q78 | Full-width banner, with the site title in large white text across the middle and the round logo overlapping its bottom edge |
| Logo | `…/images/logo_sm.png` (400×400), `logo-96.png`, `logo.png`, favicons | square PNG | Round avatar under the banner, in the slim top bar at 36px, on share cards at 44px |

These sizes put constraints on the art:

- **It has to read at thumbnail size.** At 240px, and on a phone even smaller, only one strong shape and one area of light survive. Fine detail is lost.
- **The share card crops the sides.** The share card takes a 500×630 portrait slice from the middle of the square painting, dropping about 10% at each side. Keep the focal point in the central two-thirds.
- **It has to work as a set.** Theme cards sit in a grid of 3–4 per row, so each painting should differ in subject but share medium, darkness and palette logic.
- **The banner must leave room for the title.** The middle of the banner sits behind large white text and the bottom centre behind the logo. Both areas need to be dark and calm.

Missing paintings fall back to `default-theme.webp`, a flat grey placeholder. It's not a style example.

### Preparing a Generated Image

1. Generate square (`--ar 1:1`) and upscale.
2. Save the painting as an 800×800 WebP at quality 80, and a 240×240 thumbnail with the same name in `thumbs/`. From the repo root, with the project's own sharp:
   ```bash
   node -e "const s=require('sharp'); const [i,k]=process.argv.slice(1); s(i).resize(800,800).webp({quality:80}).toFile('sites/contemplative/public/assets/images/themes/'+k+'.webp'); s(i).resize(240,240).webp({quality:80}).toFile('sites/contemplative/public/assets/images/themes/thumbs/'+k+'.webp')" input.png <theme_key>
   ```
3. Set `image_format: webp` in the theme's front matter, then build: the share cards regenerate from the new painting.

## Contemplative Neuroscience

### The Visual Language

**Medium: a textured oil painting on canvas.** Visible brushwork, with thick palette-knife impasto in the light areas, thin scumbled and dry-brushed darks, canvas weave showing through, and sometimes vertical scratches or drips in the ground. It should look like a photograph of a real painting, never a digital render.

**Subject: one natural phenomenon standing in for the theme.** Water (a wave, ripples, a still sea), sky (cloud, mist, storm light), fire and embers, a shaft of light, dust or sparks, ice, a nebula or galaxy, a tree. The metaphor is direct but never literal. Craving is a wave whose crest is on fire; emotion is ripples spreading from one drop; the self is a soft cloud of light in darkness. There are no people, faces, hands, meditators, Buddhas, lotuses, brains, neurons drawn as diagrams, symbols or text.

**Composition: one focal point near the centre, surrounded by space.** A single area of light (a glow, a flare, a bright crack) sits roughly in the middle against a large, quiet field. Horizons, when there are any, sit low. No borders or frames. The edges fade into darkness or texture.

**Light and palette: a dark ground with one luminous accent.** Most paintings are low-key. The ground is near-black, deep navy, slate teal or charcoal (measured backgrounds are about #0e2227–#1a1b19). One warm or cool light breaks through it:
- ember orange and coral (#e69870, #bd775a, #b9725c) for heat, desire, the body;
- amber and old gold (#e0a45c, #bd956f, #ddca9f) for time, attention, sleep;
- silver, pearl and pale blue (#a6b7bb, #bbb6c2, #c5cadc, #82a8c5) for fragility, fading, the self, pain.

Two themes are deliberately high-key: compassion (warm peach and lavender clouds against a soft aqua sky) and deep states (a pale pearl sea, almost white). Use light for themes about warmth, openness or stillness; otherwise stay dark.

**Mood: quiet, contemplative and a little mysterious.** Like a nocturne, or the moment just before or after something happens. Not cheerful, not dramatic horror, not sci-fi. The historical touchstones are tonalist nocturnes (Whistler), Turner's late light and sea paintings, and contemporary atmospheric abstract painting.

### Avoid

Photorealism; glossy 3D or digital-art rendering; neon, cyberpunk or sci-fi glow; fantasy illustration; saturated rainbow colour; busy scenes or several focal points; symmetry like a logo; anything literal (brains, people meditating, lotus flowers, chakras, temples); text, letters or watermarks; vignettes and frames.

### The Theme Paintings

| Theme (`theme_key`) | Subject | Palette | What it stands for |
|---|---|---|---|
| Adverse effects (`adverse-effects`) | A sheet of ice or glass seen from above, fractures radiating from a bright point of impact | Slate teal ground, pale cyan-white cracks | Fragility, something giving way |
| Aging (`aging`) | Concentric rings swirling inward like tree rings or a vortex, with a warm glow at the centre | Charcoal, a faint gold rim, amber core | Time accumulating |
| Biological health (`biological-health`) | A tree whose branches are glowing red-orange veins, brightest at the trunk | Green-black ground, ember orange | The body's branching networks |
| Brain structure (`brain-structure`) | Dark folded ridges filling the frame, like cortical folds or mountains from the air | Near-monochrome charcoal and blue-grey | Physical structure, folds |
| Compassion (`compassion`) | Billowing clouds lit warmly from one side, with flecks of gold, in thick impasto | Peach, pink and lavender on soft aqua (light) | Warmth, openness |
| Craving (`craving`) | A wave breaking on a dark sea, its crest on fire, sparks in the air | Deep teal night, flame orange | Desire as heat that rises and breaks |
| Death (`death`) | A faint glow of silvery mist dissolving into a black void | Black, pale silver-violet | Fading, the unknown |
| Deep states (`deep-states`) | A calm, luminous sea stretching to a hazy horizon, the sun diffused | Pearl, cream and silver (light, near-monochrome) | Stillness, absorption |
| Emotion (`emotion`) | Concentric ripples spreading across dark water from one drop, glowing orange at the centre; canvas texture visible | Navy, ember orange | Feeling spreading outward from a cause |
| Immunity (`immunity`) | A soft-focus cluster of glowing spheres, some coral-red, some teal | Near-black, coral and teal | Cells, defence |
| Mental health (`mental-health`) | Coral-pink light breaking through dark blue storm cloud and mist | Navy and grey-blue, rose light | Light returning after a storm |
| Focus and mind wandering (`mind-wandering`) | A single vertical shaft of golden light falling through darkness, gold dust drifting and scattering at its base | Umber-black, amber gold | Attention held, and drifting away |
| Brain (`neurological-correlates`) | A dark, scratched ground with a pale gold-green haze, gold particles glittering through it | Charcoal, pale gold | Signals and activity in the dark |
| Pain (`pain`) | A sharp red flare, like a crack of lightning, meeting billowing blue-white spray in the dark | Charcoal and steel blue, one red accent | A sudden sharp signal against calm |
| Self (`self`) | A soft cloud of blue-white light, like a nebula, centred in deep navy darkness | Navy, silver-blue | A self without hard edges |
| Sleep (`sleep`) | A swirling galaxy of blue and gold, heavily textured, scattered stars | Night blue, teal, warm gold (the most saturated) | Night, drifting off |

When adding a theme, choose a natural phenomenon not already used above, and a palette that sits beside its neighbours in its group on the home page (`site.themeGroups`) without repeating them.

### The Home Banner

A wide deep-space nebula: violet and lavender clouds on the left and centre, fading to slate green-grey at the right, with a fine star field. Unlike the paintings, it's photographic and digital. It's dark enough everywhere for white text, with no bright stars or focal points behind the title.

### The Logo

A head in profile, facing right, as a silhouette filled with galaxy and nebula imagery (deep navy, teal and violet, with stars), with a white spiral curving out from the centre of the head. The style is a flat-silhouette double exposure, on a white background.

### Prompt Recipe

Build the prompt in this order: **medium, subject (the metaphor), light, palette, composition, texture, mood**, then the parameters. Name one subject and one light source. Spell out the palette in plain colour words. Keep the prompt to one or two sentences; Midjourney weights the first words most.

```
textured oil painting on canvas, <one natural phenomenon as the metaphor>, <the single light source and where it falls>,
<ground colour> with <accent colour>, single focal point in the centre, large dark negative space, visible brushstrokes
and palette-knife impasto, canvas texture, quiet contemplative atmosphere, tonalist nocturne
--ar 1:1 --no people, faces, figures, text, letters, watermark, frame, border, 3d render, photograph, neon
```

For consistency with the existing set, give Midjourney two or three of the existing paintings as **style references** (`--sref` with their image URLs, for example `https://contemplativeneuroscience.com/assets/images/themes/emotion.webp`, or the images uploaded to Midjourney). Use a moderate style weight (`--sw`) so the reference sets the medium and palette without copying the subject. Pick references whose palette suits the new theme: warm (`craving`, `emotion`, `mind-wandering`), cool (`self`, `adverse-effects`, `pain`) or light (`compassion`, `deep-states`). Parameter names change between Midjourney versions, so check them against Midjourney's current documentation.

Generate several variations and choose the one that still reads at 240px, keeps its focal point inside the middle two-thirds, and looks like a painting rather than a render.

**Example: a new "Attention" theme**

```
textured oil painting on canvas, a single candle flame burning perfectly still in a dark room, a thin thread of smoke
rising straight up, warm amber light falling off quickly into darkness, umber-black ground with amber gold,
single focal point in the centre, large dark negative space, visible brushstrokes and palette-knife impasto, canvas
texture, quiet contemplative atmosphere, tonalist nocturne
--ar 1:1 --sref <emotion.webp URL> <mind-wandering.webp URL> --sw 200 --no people, faces, figures, text, letters,
watermark, frame, border, 3d render, photograph, neon
```

**Example: regenerating the Emotion painting**

```
textured oil painting on canvas, concentric ripples spreading across still dark water from a single falling drop,
the centre of the ripples glowing ember orange as if lit from below, deep navy ground, single focal point in the
centre, large dark negative space, thick paint on the ripple crests, canvas weave visible in the dark water, quiet
contemplative atmosphere
--ar 1:1 --no people, text, frame, border, 3d render, photograph
```

**For a banner**, use `--ar 5:2` (then crop to 2048×835), ask for "deep space nebula, violet and lavender clouds fading to slate green, fine star field, photographic", and add "dark and even across the centre, no bright stars in the middle" so the title stays readable.

## Training Evidence

*Draft direction, from five reference covers the site owner liked (cover art in the Waking Up meditation app). The style is mid-century modern abstraction. Describe it in prompts with the words below; never use another product's covers as style references or recreate a specific cover. The placeholder art in `sites/training/public/assets/images/` is still to be replaced.*

### What the References Have in Common

**A 1960s abstract print.** Each cover looks like a mid-century modern work on paper. It might be a screen print, a hard-edge painting, a cut-paper collage or a Swiss-style poster. It's flat, graphic and handmade, not painterly like the sister site's oils, and never glossy or digital.

**One bold geometric motif, centred.** Each cover is built from simple shapes: discs, rings, arcs, quarter-circles, half-moons, triangles, spirals and parallel bands. Usually one large form (a sun-like disc, a set of concentric rings, a spiral of quarter-circles, a triangle under a blob) sits in the middle with generous margins. The composition is often symmetric or split in two, for example light above and dark below, or a flat half and an engraved half.

**The human figure reduced to geometry.** A head in profile repeated in staggered layers like a motion echo, a bust broken into segments, a rounded blob with a circle for a head. People appear, but only as shapes and silhouettes, never faces with features.

**Collage with vintage scientific imagery.** Flat colour shapes are combined with one old printed element: a 19th-century engraving (a nautilus shell), a technical drawing (fine ruled lines ending in small circles, a contour or flow diagram), or a muted photograph (layered blue mountain ridges). This makes the covers feel both intellectual and handmade.

**Printed, aged texture.** Cream or aged beige paper, fine grain, speckles and dust, slightly worn ink, occasional misregistration. Gradients are rare, and soft and grainy when they appear. One reference uses smooth retro rainbow gradients converging on a point, like a 1970s prism.

**Colour: a restricted, warm, earthy print palette.** Typically three to five inks plus the paper:

- **Grounds:** warm cream and off-white (about #f6efe2), aged parchment and beige (#e8dcc6), or charcoal-black (#22201d) and deep navy (#141a2e).
- **Warm inks:** vermilion and tomato red (#d9442b), deep crimson (#a3141e), brick and rust (#9b4a2c), burnt orange (#e0702f), mustard and ochre (#e2b04a), golden yellow (#f2b43c).
- **Cool and earthy inks:** slate and Prussian blue (#3f6d8c), teal (#1f7a7a), dusty blue-grey (#9fb3c2), olive green (#8b9a5b).
- **How they're combined:** warm reds and ochres against one cool blue or teal, with large areas of cream or black. The colours are fully saturated but slightly muted by the paper, as if printed rather than lit.

### Palette for Training Evidence

Keep the references' warm print palette, and let the site's sky blue (#0ea5e9, which also appears as a softer #7dd3fc or #38bdf8 in prints) be the recurring cool ink, so every cover ties back to the brand. Ground on cream paper or deep navy (#082f49, the site's top bar). A typical set: cream ground, vermilion, mustard, sky blue, navy. Vary which warm ink leads from theme to theme, so the home-page grid reads as a set and not a repeat.

### Subjects: Exercise as Geometry

Abstract the sport into the shapes the references already use. Combine one flat geometric motif with at most one vintage collage element:

Themes are grouped: three parents (Strength, Cardio, Supplements), each with sub-themes (`site.themeGroups` in `sites/training/site.ts`). A sub-theme's image should look related to its parent's, for example sharing the parent's leading ink.

| Theme (`theme_key`) | Motif ideas | Collage element ideas |
|---|---|---|
| Strength Training (`strength`), parent | A barbell seen end-on as stacked concentric discs (the plates), or a long horizontal bar with discs at each end balanced over a triangle | A fine technical drawing of a lever and fulcrum; a 19th-century anatomical engraving of an arm |
| Building Muscle (`muscle`), under Strength | Bundles of parallel bands curving into a half-moon, like muscle fibres; stacked arcs growing in size | An old anatomical engraving of a muscle, cropped into a circle |
| Cardio (`cardio`), parent | Running-track lanes as concentric arcs in coloured bands, under a sun disc; a profile repeated in staggered layers, like a motion echo | A Victorian chronophotography sequence of a runner; a faint heart-rate trace in fine ruled line |
| Interval Training (`intervals`), under Cardio | Alternating tall and short bars or blocks in a rhythm, like a work-and-rest pattern; a sun disc cut into segments | A stopwatch dial engraving; a fine ruled chart of alternating peaks |
| Supplements (`supplements`), parent | A capsule split into two colours, a scoop's circle, or small discs arranged like a molecule | A hexagonal molecular diagram in technical line work |
| Creatine (`creatine`), under Supplements | A cluster of crystal-like facets or small squares stacked into a pyramid, beside a disc | A crystal lattice or molecular structure drawing in fine line |

### Avoid

Recreating or closely imitating any existing cover or artist; photographs or realistic renders of athletes or gyms; faces with features; glossy 3D, neon or gradients that glow; clip-art icons (dumbbell emoji style); more than one focal motif; busy backgrounds; text, letters, numbers or watermarks; drop shadows.

### Placements

- **Theme images:** square, with the motif inside the central two-thirds (the share card crops the sides). Bold flat shapes read well at 240px, so keep collage detail secondary.
- **Banner** (2048×835, behind the white site title): use a deep navy ground (not cream, or the white title disappears), with the shapes along the bottom and edges and the middle left quiet. For example, a row of rising sun-discs and arcs across the lower third.
- **Logo:** a single geometric mark that works at 36px, for example a barbell end-on as two concentric discs in sky blue and vermilion on cream.
- **Wide video thumbnails or covers:** use `--ar 16:9`, with the motif centred and the sides left as plain paper so titles can sit beside it.

### Prompt Recipe

Order: **medium and era, motif, collage element, palette, composition, texture**, then the parameters. Name the inks.

```
mid-century modern abstract screen print, <one geometric motif standing in for the theme>, collaged with <one vintage
scientific engraving or technical drawing>, limited palette of <3–4 inks, e.g. vermilion red, mustard yellow and sky
blue> with deep navy on aged cream paper, bold centered composition with wide margins, flat color, subtle paper grain,
speckled worn ink, slight print misregistration, 1960s hard-edge painting and Swiss poster design
--ar 1:1 --no photograph, 3d render, glossy, neon, glow, text, letters, numbers, logo, watermark, frame, faces
```

Once a few covers exist that you like, use two or three of them as `--sref` style references to keep the set consistent (only images made for this site, never the reference covers). Generate several, and pick the one that reads at 240px and keeps the motif inside the middle two-thirds.

**Example: Strength**

```
mid-century modern abstract screen print, a barbell seen end-on as three stacked concentric discs balanced on a narrow
vermilion triangle, collaged with a faint 19th-century technical drawing of a lever and fulcrum in fine black line,
limited palette of vermilion red, mustard yellow and sky blue with deep navy on aged cream paper, bold centered
composition with wide margins, flat color, subtle paper grain, speckled worn ink, slight print misregistration,
1960s hard-edge painting and Swiss poster design
--ar 1:1 --no photograph, 3d render, glossy, neon, glow, text, letters, numbers, logo, watermark, frame, faces
```

**Example: Cardio**

```
mid-century modern abstract screen print, a runner in profile reduced to flat geometric shapes and repeated five
times in staggered overlapping layers like a motion echo, each layer a different ink, beneath a large sky blue sun
disc, collaged with a faint Victorian chronophotography strip, limited palette of sky blue, burnt orange, mustard and
teal with deep navy on aged cream paper, bold centered composition, flat color, paper grain, speckled worn ink
--ar 1:1 --no photograph, 3d render, glossy, neon, glow, text, letters, numbers, logo, watermark, frame, facial features
```
