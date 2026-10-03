# Life Sciences Deal Intelligence

**An automated deal-intelligence platform for exploring M&A, licensing and strategic partnership activity across the life sciences industry.**

### [→ Explore the Live Dashboard](https://script.google.com/macros/s/AKfycbz4KAzPzZhJRBJuI3WLidHgfckTCeYKUuaixeDazMwmRaxRSWY5P8bbf5103VC0h9iV/exec)

![Life Sciences Deal Intelligence Dashboard](docs/screenshot.png)

---

## Why I built this

External innovation plays an important role in how pharmaceutical and biotechnology companies **expand pipelines, access new technologies, enter therapeutic areas and build new capabilities**.

However, information about these transactions is fragmented across industry news, company announcements and other public sources.

I built **Life Sciences Deal Intelligence** to create a structured way of tracking this activity and, more importantly, to use the resulting dataset to investigate commercial and strategic questions such as:

- Where is deal activity concentrated across therapeutic areas and modalities?
- At what stages of development are companies accessing external innovation?
- When are companies using acquisitions versus licensing or partnerships?
- Which companies are particularly active in external innovation?
- What can individual transactions reveal about portfolio and pipeline strategy?

The project combines **automated data collection, LLM-assisted information extraction and an interactive dashboard** with commercial analysis of the resulting deal landscape.

---

## What the platform does

The pipeline converts fragmented life-sciences news into a structured transaction dataset.

```text
Life-sciences news sources
          ↓
Automated article collection
          ↓
Potential deal identification
          ↓
LLM-assisted extraction
          ↓
Classification & standardisation
          ↓
Cross-source deduplication
          ↓
Data validation
          ↓
Structured deal database
          ↓
Interactive dashboard
          ↓
Commercial & strategic analysis
```

Transactions are structured across fields including:

**Deal type · Buyer · Target · Therapeutic area · Disease area · Modality · Development stage · Deal value · Geography · Status · Strategic rationale**

### [Explore the live dashboard →](https://script.google.com/macros/s/AKfycbz4KAzPzZhJRBJuI3WLidHgfckTCeYKUuaixeDazMwmRaxRSWY5P8bbf5103VC0h9iV/exec)

---

## From data to strategy

The dashboard is the **starting point rather than the final output**.

I am using the resulting dataset to investigate broader questions around **external innovation and pharmaceutical strategy**.

### Industry trends

Where are pharmaceutical and biotechnology companies accessing external innovation, and how does activity vary across therapeutic areas, modalities and development stages?

### Build vs buy vs partner

How does transaction structure vary across assets and technologies, and when are companies using acquisitions, licensing agreements or strategic partnerships?

### Portfolio strategy

How are companies using external transactions to strengthen pipelines, enter new therapeutic areas or access new technologies and capabilities?

### Strategic deal deep dives

Selected transactions are analysed in greater depth to examine:

- portfolio and pipeline fit
- competitive context
- transaction structure
- asset and technology characteristics
- strategic rationale
- key commercial and development risks

These analyses and case studies will be added to the project as the dataset develops.

---

## What can be explored?

The interactive dashboard enables exploration of transactions from both an industry-level and individual-deal perspective.

### Deal landscape

Explore M&A, licensing and partnership activity over time.

### Therapeutic areas

Investigate where external innovation activity is concentrated across therapeutic areas such as oncology, immunology and neuroscience.

### Modalities

Compare activity across small molecules, biologics, cell and gene therapies and other technologies.

### Development stage

Explore whether companies are accessing innovation at discovery, preclinical, clinical or commercial stages.

### Companies

Identify buyers, targets and organisations appearing repeatedly across the deal landscape.

### Individual transactions

Explore individual deals in more detail, including the companies involved, transaction structure, therapeutic area, modality, development stage, strategic rationale and underlying source material.

---

## Data sources

The pipeline currently aggregates selected publicly available life-sciences news feeds, including:

- Fierce Pharma
- Fierce Biotech
- BioPharma Dive
- STAT
- Genetic Engineering & Biotechnology News (GEN)
- Configurable Google News searches

The purpose is **not to create an exhaustive commercial transactions database**, but to build a structured dataset suitable for exploring patterns in publicly reported life-sciences deal activity.

---

## Data quality & methodology

Automated extraction makes it possible to process a larger volume of unstructured information, but an LLM-generated field or confidence score should not automatically be treated as ground truth.

The pipeline therefore separates **model confidence from data validation** and surfaces potential quality issues for review.

| Dimension | Purpose |
|---|---|
| **Review State** | Flags records that may require manual review |
| **Validation Status** | Indicates the level of source corroboration |
| **Missing Fields** | Identifies expected information that could not be extracted |
| **Consistency Issues** | Flags structural or taxonomy inconsistencies |
| **Confidence** | Records model-reported certainty separately from validation |

Transactions used for **commercial analysis and strategic case studies are manually checked against their underlying source material**.

### Important limitations

The dataset reflects **publicly reported transactions captured by the selected sources**, rather than the complete universe of life-sciences transactions.

Deal values are frequently undisclosed. Publicly announced headline values may also combine upfront payments, development or commercial milestones and other contingent payments.

Development stage, indication and modality classifications can be ambiguous for complex transactions or platform-level agreements.

Analyses are therefore interpreted alongside the underlying transaction context rather than treating every extracted field as equally certain.

---

# Technical Details

## How it works

The platform runs as a serverless pipeline using **Google Apps Script, Google Sheets and the DeepSeek API**.

```text
                    ┌───────────────────────────────────────┐
Industry feeds ────▶│        Google Apps Script             │
                    │                                        │
                    │  Collect articles                      │
                    │        ↓                               │
                    │  Identify potential deals              │
                    │        ↓                               │
                    │  LLM extraction ─────▶ DeepSeek API    │
                    │        ↓                               │
                    │  Standardise + deduplicate             │
                    │        ↓                               │
                    │  Validate records                      │
                    │        ↓                               │
                    │  Google Sheets deal database           │
                    └───────────────────────────────────────┘
                                  ↓
                         Interactive web app
```

Google Sheets acts as the structured data layer, while Apps Script manages ingestion, extraction, classification, deduplication and validation.

The resulting data is served through an Apps Script web application that provides the interactive dashboard.

---

## Core pipeline

| Function | Responsibility |
|---|---|
| `fetchNewsFeeds()` | Collects articles from active sources and removes URL/headline duplicates |
| `flagPotentialDeals()` | Uses keyword rules to identify likely transaction articles before LLM processing |
| `processPotentialDeals()` | Extracts structured information, maps taxonomies and performs cross-source deduplication |
| `validateExistingDeals()` | Applies validation and consistency checks to structured records |
| `runDealPipeline()` | Orchestrates pipeline stages and records execution information |

A keyword pre-filter is used before LLM processing to reduce unnecessary API calls and focus extraction on articles more likely to describe relevant transactions.

---

## Dashboard

The web application currently includes:

- headline transaction KPIs
- M&A, licensing and partnership activity
- deal activity over time
- therapeutic-area analysis
- modality analysis
- development-stage filtering
- company and keyword search
- multi-dimensional filtering
- sortable transaction table
- individual deal detail views
- links to underlying source material

### [→ Launch the Live Dashboard](https://script.google.com/macros/s/AKfycbz4KAzPzZhJRBJuI3WLidHgfckTCeYKUuaixeDazMwmRaxRSWY5P8bbf5103VC0h9iV/exec)

---

## Reliability

Google Apps Script imposes execution-time constraints, so the pipeline was designed to operate incrementally and recover from interrupted processing.

Key features include:

- **Resumable processing** — progress is retained between pipeline runs
- **Execution locking** — prevents overlapping pipeline executions
- **Cross-source deduplication** — reduces duplicate transactions reported by multiple publications
- **Bulk spreadsheet operations** — reduces unnecessary sheet reads and writes
- **Pipeline logging** — records ingestion and processing activity
- **Recovery functions** — identifies transactions interrupted during processing

---

## Technology

`Google Apps Script` · `JavaScript` · `HTML/CSS` · `Google Sheets` · `DeepSeek API` · `RSS`

---

## Repository structure

```text
MA.js                  # ingestion, extraction, deduplication and validation
webpage.js             # dashboard data preparation and web-app functions
index.html             # interactive dashboard
appsscript.json        # Apps Script configuration
.clasp.json.example    # example Apps Script configuration
docs/                  # project images and documentation
```

---

## Technical implementation

The platform was built using **Google Apps Script, JavaScript, HTML/CSS, Google Sheets and the DeepSeek API**.

Google Sheets acts as the structured data layer, while Apps Script manages news ingestion, LLM-assisted extraction, classification, deduplication and validation.

The dashboard is served as an Apps Script web application.

API credentials and deployment-specific configuration are stored securely using **Apps Script Properties** and are not included in this repository.

The repository contains the core project code for transparency and demonstration purposes; the deployed version can be explored through the live dashboard.

---

## Project status

**Active development**

The core data pipeline and dashboard are operational.

Current development is focused on moving from **deal tracking to commercial insight**, including:

- expanding and validating the transaction dataset
- analysing external-innovation trends
- investigating patterns across therapeutic areas, modalities and development stages
- comparing M&A, licensing and partnership strategies
- developing strategic case studies of selected pharmaceutical transactions

---

## Explore the project

### [→ Open the Live Life Sciences Deal Intelligence Dashboard](https://script.google.com/macros/s/AKfycbz4KAzPzZhJRBJuI3WLidHgfckTCeYKUuaixeDazMwmRaxRSWY5P8bbf5103VC0h9iV/exec)

---

## Licence

Copyright © 2026 Dilaan Shiprasad. All rights reserved.

This project is shared publicly for **portfolio viewing and evaluation purposes**. No permission is granted to copy, modify, redistribute, publish, sublicense or sell the source code or substantial portions of the project without prior written permission.

See [LICENSE](LICENSE) for full terms.
