# examples/eco

The complete, production-tested brand configuration this tracker was extracted
from: Eco, a stablecoin infrastructure company, tracking @eco on X across nine
content pillars. Read it to see what a finished `brand/` looks like, or copy it
over the starter to run the tracker exactly as the original deployment did:

```bash
cp examples/eco/*.ts brand/
```

Pillar ids are stored as text, so no database change is needed to use this
example; a database that already holds posts classified under a different set
needs `scripts/reclassify.ts`.
