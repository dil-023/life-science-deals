**[Open the live dashboard →](https://script.google.com/macros/s/AKfycbz4KAzPzZhJRBJuI3WLidHgfckTCeYKUuaixeDazMwmRaxRSWY5P8bbf5103VC0h9iV/exec)**

# Life Sciences Deal Intelligence

A serverless pipeline that ingests life-sciences news, uses an LLM to extract
M&A, licensing, partnership and investment deals into a structured dataset, and
serves an interactive dashboard for commercial and strategic analysis.

Built with **Google Apps Script**, **Google Sheets** and the **DeepSeek** API —
no servers, no infrastructure.

![Dashboard](docs/screenshot.png)

---

## What it does

1. **Ingests** RSS feeds (Fierce Pharma/Biotech, BioPharma Dive, STAT, GEN, plus
   configurable Google News searches).
2. **Pre-filters** articles with a keyword rule to control LLM cost.
3. **Extracts** structured deal data with an LLM using strict taxonomies
   (buyer/target, deal type, therapeutic area, modality, stage, value, rationale…).
4. **Deduplicates** across sources by URL and by normalised buyer+target+type
   with a date window, and counts corroborating sources.
5. **Validates** every record with an explainable model (see below).
6. **Serves** a single-page dashboard (KPIs, charts, filters, detail drawer).

## Architecture

```
                    ┌──────────────────────────────────────────────┐
   RSS / Google     │                Google Apps Script            │
   News feeds ─────▶│  fetchNewsFeeds()                            │
                    │       │                                      │
                    │       ▼                                      │
                    │  flagPotentialDeals()   (keyword pre-filter) │
                    │       │                                      │
                    │       ▼                                      │
                    │  processPotentialDeals() ──▶ DeepSeek API    │
                    │       │  (extract + taxonomy + dedupe)       │
                    │       ▼                                      │
                    │  validateExistingDeals() (quality model)     │
                    │       │                                      │
                    │       ▼                                      │
                    │  Google Sheets: Deals / News Feed / Sources /│
                    │                 Pipeline Log / Taxonomy      │
                    └──────────────────────────────────────────────┘
                                     │
                                     ▼
                    Web app (HtmlService + google.script.run)
                    KPIs · charts · filters · detail drawer
```

### Pipeline stages

| Function | Responsibility |
|---|---|
| `fetchNewsFeeds()` | Pull active feeds from the **Sources** sheet + Google News; dedupe by URL/headline |
| `flagPotentialDeals()` | Keyword regex pre-filter; returns seen/flagged counts |
| `processPotentialDeals()` | LLM extraction, taxonomy mapping, money normalisation, cross-source dedupe |
| `validateExistingDeals()` | Computes the verification model for every row (bulk read/write) |
| `runDealPipeline()` | Orchestrates all stages with a lock, per-stage error isolation and a run log |

## Verification model

Instead of one opaque "quality score", each record exposes independent,
actionable dimensions:

| Dimension | Values | Meaning |
|---|---|---|
| **Review State** | `OK` / `Review` / `Reject` | Does a human need to act? `Reject` = hard structural error (buyer = target, negative/future date) |
| **Validation Status** (provenance) | `Verified` / `Corroborated` / `Single source` / `Unverified` | How independently corroborated the record is |
| **Missing Fields** | list | Expected fields that are empty |
| **Consistency Issues** | list | Unmapped taxonomy values, ambiguous money, stale status, structural problems |
| **Confidence** | 0–1 | The model's self-reported certainty (kept separate; not a truth metric) |

## Reliability

- **Resumable execution budget** — Apps Script stops runs at ~6 minutes. Each
  stage stops cleanly within a configurable budget (`MAX_RUNTIME_MS`, default
  4.5 min) and resumes on the next run, because articles are marked processed
  incrementally.
- **LockService** prevents overlapping runs.
- **Bulk sheet I/O** — validation reads once and writes once, and skips blank rows.
- **Run log** — a `Pipeline Log` sheet records feeds, articles seen/flagged/
  processed, deferred, deals added/updated, review/reject counts and duration.
- **Recovery tools** — `findUnwrittenDeals()` and `reprocessUnwrittenDeals()`
  detect and recover deals lost to a mid-run timeout.

## Dashboard

- KPI cards: deals, M&A, licensing, partnerships, therapeutic areas.
- Deal activity timeline; deal-type / therapeutic-area / modality bars.
- Filters: search, date, deal type, therapeutic area, modality, stage, disease
  area, company, currency, status, country.
- Sortable table; detail drawer with sources, evidence, missing fields,
  consistency issues and confidence.

## Tech stack

HTML · JavaScript

## Project structure

```
MA.js                  # pipeline: fetching, extraction, dedupe, validation
webpage.js             # doGet() + getDashboardData() data shaping
index.html             # single-page dashboard (HTML/CSS/JS)
appsscript.json        # Apps Script manifest
.clasp.json.example    # copy to .clasp.json and add your scriptId
```

## Setup

### Prerequisites
- Node.js + [`@google/clasp`](https://github.com/google/clasp)
- A Google account with a Google Sheet

### 1. Create the spreadsheet
Create a Google Sheet with these tabs: `Deals`, `News Feed`, `Sources`,
`Taxonomy` (optional: `Pipeline Log` is created automatically).

### 2. Link and push
```bash
npm install -g @google/clasp
clasp login
cp .clasp.json.example .clasp.json   # then paste your scriptId
clasp push
```

### 3. Configure Script Properties
In the Apps Script editor → **Project Settings → Script Properties**:

| Property | Required | Default | Purpose |
|---|---|---|---|
| `DEEPSEEK_API_KEY` | yes | — | DeepSeek API key |
| `GOOGLE_NEWS_QUERIES` | no | built-in list | Pipe-separated searches; set to `none` to disable |
| `MAX_RUNTIME_MS` | no | `270000` | Per-stage execution budget |

### 4. One-time setup
In the editor run `setupProject()` (writes headers + data-validation dropdowns),
then `validateExistingDeals()`.

### 5. Run
Run `runEverything()` for a full cycle, or schedule it with
`installPipelineTrigger(6)` (every 6 hours) / `installFrequentTrigger(15)`
(every 15 minutes while draining a backlog).

## License

MIT — see [LICENSE](LICENSE).
