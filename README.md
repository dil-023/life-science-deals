**[Open the live dashboard →](https://script.google.com/macros/s/AKfycbz4KAzPzZhJRBJuI3WLidHgfckTCeYKUuaixeDazMwmRaxRSWY5P8bbf5103VC0h9iV/exec)**

# Life Sciences Deal Intelligence

**An automated deal-intelligence platform for exploring M&A, licensing and strategic partnership activity across the life sciences industry.**

<img width="1146" height="1161" alt="image" src="https://github.com/user-attachments/assets/7b74a82c-91c3-4841-a3dc-5d263d074070" />
<img width="1107" height="998" alt="image" src="https://github.com/user-attachments/assets/58ff2a16-a333-4042-9f8c-dfd2d46e2226" />

---

## Why I built this

External innovation plays a major role in how pharmaceutical and biotechnology companies expand pipelines, access new technologies and enter new therapeutic areas.

However, information about these transactions is fragmented across industry news sources and company announcements.

I built **Life Sciences Deal Intelligence** to create a structured way of tracking this activity and, more importantly, to use the resulting dataset to investigate commercial and strategic questions such as:

- Where is deal activity concentrated across therapeutic areas and modalities?
- At what stages of development are companies accessing external innovation?
- When are companies using acquisitions versus licensing or partnerships?
- Which companies are particularly active in external innovation?
- What can individual transactions tell us about portfolio and pipeline strategy?

The project combines **automated data collection, LLM-assisted information extraction and an interactive dashboard** with commercial analysis of the resulting deal landscape.

---

## What the platform does

The pipeline converts fragmented life-sciences news into a structured transaction dataset:

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

Deals are structured across fields including:

**Deal type · Buyer · Target · Therapeutic area · Disease area · Modality · Development stage · Deal value · Geography · Status · Strategic rationale**

### [Explore the live dashboard →](https://script.google.com/macros/s/AKfycbz4KAzPzZhJRBJuI3WLidHgfckTCeYKUuaixeDazMwmRaxRSWY5P8bbf5103VC0h9iV/exec)

---

## What can be explored?

The dashboard is designed to move from individual transactions to broader industry patterns.

### Deal landscape
Explore M&A, licensing and partnership activity over time and across the life-sciences sector.

### Therapeutic areas
Investigate where external innovation activity is concentrated across areas such as oncology, immunology and neuroscience.

### Modalities
Compare activity across small molecules, biologics, cell and gene therapies and other technologies.

### Development stage
Explore whether companies are accessing innovation at discovery, clinical or commercial stages.

### Companies
Identify buyers, targets and organisations appearing repeatedly across the deal landscape.

### Individual transactions
Open individual deals to examine the companies involved, transaction structure, development stage, strategic rationale and underlying sources.

---

## From data to strategy

The dashboard is the first stage of the project rather than the final output.

I am using the resulting dataset to conduct additional analysis of **external innovation and pharmaceutical strategy**, including:

**Industry trends**  
Where are companies allocating capital and accessing external innovation?

**Build vs buy vs partner**  
How does transaction structure vary with asset maturity, therapeutic area and modality?

**Portfolio strategy**  
How are companies using transactions to strengthen pipelines, enter new markets or access new capabilities?

**Strategic deal deep dives**  
Selected transactions are analysed in greater depth to understand portfolio fit, competitive context, transaction structure and strategic rationale.

These analyses and case studies will be added to the repository as the dataset develops.

---

## Data sources

The pipeline currently aggregates selected publicly available life-sciences news feeds, including:

- Fierce Pharma
- Fierce Biotech
- BioPharma Dive
- STAT
- Genetic Engineering & Biotechnology News (GEN)
- Configurable Google News searches

The purpose is not to create an exhaustive commercial transactions database, but to build a dataset suitable for exploring patterns in publicly reported life-sciences deal activity.

---

## Data quality & methodology

Automated extraction is useful for processing large volumes of unstructured information, but it does not guarantee that every extracted field is correct.

I therefore designed the pipeline around **transparent validation rather than treating an LLM confidence score as a measure of truth**.

Each record can expose:

| Dimension | Purpose |
|---|---|
| **Review State** | Flags records that may require manual review |
| **Validation Status** | Indicates whether a transaction has been corroborated across sources |
| **Missing Fields** | Identifies expected information that could not be extracted |
| **Consistency Issues** | Flags structural or taxonomy inconsistencies |
| **Confidence** | Records model certainty separately from validation |

Transactions used for deeper commercial analysis can therefore be manually checked against the underlying source material.

### Important limitations

The dataset reflects **publicly reported transactions captured by the selected sources**, rather than the complete life-sciences deal universe.

Deal values are frequently undisclosed, and announced headline values may combine upfront payments, milestones and other contingent payments. Development stage, indication and modality classifications can also be ambiguous for complex transactions.

For these reasons, analysis is interpreted alongside the underlying deal context rather than treating every extracted field as equally certain.

---

## How it works

The platform runs as a serverless pipeline using **Google Apps Script, Google Sheets and the DeepSeek API**.

```text
                    ┌───────────────────────────────────────┐
Industry feeds ────▶│        Google Apps Script            │
                    │                                       │
                    │  Collect articles                     │
                    │        ↓                              │
                    │  Identify potential deals             │
                    │        ↓                              │
                    │  LLM extraction ─────▶ DeepSeek API   │
                    │        ↓                              │
                    │  Standardise + deduplicate            │
                    │        ↓                              │
                    │  Validate records                     │
                    │        ↓                              │
                    │  Google Sheets deal database          │
                    └───────────────────────────────────────┘
                                  ↓
                         Interactive web app
```

### Core pipeline

| Function | Responsibility |
|---|---|
| `fetchNewsFeeds()` | Collects articles and removes URL/headline duplicates |
| `flagPotentialDeals()` | Uses keyword rules to identify likely transaction articles before LLM processing |
| `processPotentialDeals()` | Extracts structured information, maps taxonomies and performs cross-source deduplication |
| `validateExistingDeals()` | Applies validation checks to structured records |
| `runDealPipeline()` | Orchestrates pipeline stages and records execution information |

---

## Dashboard

The web application currently includes:

- Deal, M&A, licensing and partnership KPIs
- Deal activity over time
- Therapeutic-area analysis
- Modality analysis
- Search and multi-dimensional filtering
- Sortable transaction table
- Individual deal detail views
- Links to underlying source material

### [Launch Life Sciences Deal Intelligence →](https://script.google.com/macros/s/AKfycbz4KAzPzZhJRBJuI3WLidHgfckTCeYKUuaixeDazMwmRaxRSWY5P8bbf5103VC0h9iV/exec)

---

## Reliability

Because Google Apps Script imposes execution limits, the pipeline was designed to operate incrementally.

Key features include:

- **Resumable processing** to prevent long pipeline runs from losing progress
- **Execution locking** to prevent overlapping runs
- **Cross-source deduplication** using transaction characteristics
- **Bulk spreadsheet operations** to reduce execution time
- **Pipeline logging** for monitoring ingestion and processing
- **Recovery functions** for transactions interrupted during execution

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
.clasp.json.example    # example clasp configuration
docs/                  # project images and documentation
```

---

## Running the project

### Requirements

- Google account
- Google Sheet
- Node.js and `@google/clasp`
- DeepSeek API key

### Configure the project

Create a Google Sheet containing:

```text
Deals
News Feed
Sources
Taxonomy
```

`Pipeline Log` can be generated automatically.

Clone the repository and connect it to an Apps Script project:

```bash
npm install -g @google/clasp
clasp login
cp .clasp.json.example .clasp.json
clasp push
```

Add the following under **Apps Script → Project Settings → Script Properties**:

| Property | Required | Purpose |
|---|---:|---|
| `DEEPSEEK_API_KEY` | Yes | API authentication |
| `GOOGLE_NEWS_QUERIES` | No | Configurable news searches |
| `MAX_RUNTIME_MS` | No | Pipeline execution budget |

API credentials should **never be committed to this repository**.

Run `setupProject()` once to initialise the required structure, followed by `runEverything()` to execute the pipeline.

---

## Project status

**Active development**

The data-engineering and dashboard components are operational. Current development is focused on expanding the dataset and using it for:

- commercial landscape analysis
- external-innovation trend analysis
- transaction strategy case studies
- deeper analysis of selected pharmaceutical deals

---

## Live project

### **[→ Explore the Live Life Sciences Deal Intelligence Dashboard](https://script.google.com/macros/s/AKfycbz4KAzPzZhJRBJuI3WLidHgfckTCeYKUuaixeDazMwmRaxRSWY5P8bbf5103VC0h9iV/exec)**

---

## License

MIT — see [LICENSE](LICENSE).
