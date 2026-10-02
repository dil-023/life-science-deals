function testDeepSeek() {

  var apiKey = PropertiesService
    .getScriptProperties()
    .getProperty("DEEPSEEK_API_KEY");

  if (!apiKey) {
    throw new Error("DeepSeek API key not found.");
  }

  var url = "https://api.deepseek.com/chat/completions";

  var payload = {
    model: "deepseek-chat",
    messages: [
      {
        role: "user",
        content: "Reply with exactly: DeepSeek connection successful"
      }
    ],
    temperature: 0
  };

  var options = {
    method: "post",
    contentType: "application/json",
    headers: {
      Authorization: "Bearer " + apiKey
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  var response = UrlFetchApp.fetch(url, options);

  var statusCode = response.getResponseCode();
  var responseText = response.getContentText();

  Logger.log("HTTP status: " + statusCode);
  Logger.log(responseText);

  if (statusCode !== 200) {
    throw new Error(
      "DeepSeek API error " +
      statusCode +
      ": " +
      responseText
    );
  }
}


function testOneDeal() {

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var newsSheet = ss.getSheetByName("News Feed");

  // Change this row number whenever you want to test
  // a specific News Feed article manually.
  var testRow = 12;

  var row = newsSheet
    .getRange(testRow, 1, 1, 9)
    .getValues()[0];

  var source = row[2];
  var headline = row[3];
  var url = row[4];
  var description = row[5];

  Logger.log("Analysing: " + headline);

  var apiKey = PropertiesService
    .getScriptProperties()
    .getProperty("DEEPSEEK_API_KEY");

  if (!apiKey) {
    throw new Error("DeepSeek API key not found.");
  }

  var prompt =
    "You are a life sciences M&A and strategic transactions analyst. " +

    "Determine whether this article describes a qualifying LIFE SCIENCES STRATEGIC DEAL. " +

    "QUALIFYING DEALS include: " +
    "acquisitions, mergers, licensing agreements, asset acquisitions, " +
    "commercial rights transactions, strategic collaborations, partnerships, " +
    "option agreements, equity investments, divestitures, portfolio sales, " +
    "or similar strategic transactions involving pharmaceutical, biotechnology, " +
    "medical technology or healthcare companies. " +

    "DO NOT classify the following as deals: " +
    "government contracts, ordinary customer or supplier contracts, " +
    "clinical trial results, FDA or regulatory approvals, scientific discoveries, " +
    "research publications, earnings reports, ordinary grants, or general business news. " +

    "A government contract such as a Pentagon contract should therefore be deal=false. " +

    "Return ONLY valid JSON. " +
    "The field 'deal' MUST be either true or false. " +
    "Do not invent information. " +

    "\n\nReturn exactly:" +
    "\n{" +
    "\"deal\": false," +
    "\"confidence\": null," +
    "\"reason\": null" +
    "}" +

    "\n\nARTICLE SOURCE: " + source +
    "\nHEADLINE: " + headline +
    "\nURL: " + url +
    "\nDESCRIPTION: " + description;

  var payload = {
    model: "deepseek-chat",

    messages: [
      {
        role: "system",
        content:
          "You classify life sciences strategic transactions. " +
          "Be conservative and factual. Return JSON only."
      },
      {
        role: "user",
        content: prompt
      }
    ],

    temperature: 0,

    response_format: {
      type: "json_object"
    }
  };

  var options = {
    method: "post",
    contentType: "application/json",

    headers: {
      Authorization: "Bearer " + apiKey
    },

    payload: JSON.stringify(payload),

    muteHttpExceptions: true
  };

  var response = UrlFetchApp.fetch(
    "https://api.deepseek.com/chat/completions",
    options
  );

  var statusCode = response.getResponseCode();
  var responseText = response.getContentText();

  Logger.log("HTTP status: " + statusCode);

  if (statusCode !== 200) {
    throw new Error(
      "DeepSeek API error " +
      statusCode +
      ": " +
      responseText
    );
  }

  var result = JSON.parse(responseText);

  var aiAnswer =
    result.choices[0].message.content;

  Logger.log("DEEPSEEK RESULT:");
  Logger.log(aiAnswer);

  var parsed = JSON.parse(aiAnswer);

  Logger.log("DEAL? " + parsed.deal);
  Logger.log("CONFIDENCE: " + parsed.confidence);
  Logger.log("REASON: " + parsed.reason);
}


// ======================================================
// TAXONOMIES (global)
// ======================================================

var dealTypes = [
  "Acquisition",
  "Merger",
  "Asset Acquisition",
  "Divestiture",
  "Licensing",
  "In-Licensing",
  "Out-Licensing",
  "Co-Development",
  "Co-Commercialisation",
  "Partnership",
  "Joint Venture",
  "Strategic Investment",
  "Venture Investment",
  "Other"
];

var therapeuticAreas = [
  "Oncology",
  "Immunology",
  "Cardiovascular",
  "Metabolic",
  "Diabetes",
  "Obesity",
  "Neurology",
  "Psychiatry",
  "Neurodegenerative",
  "Rare Disease",
  "Infectious Disease",
  "Vaccines",
  "Respiratory",
  "Gastroenterology",
  "Dermatology",
  "Ophthalmology",
  "Women's Health",
  "Haematology",
  "Renal",
  "Musculoskeletal",
  "Endocrinology",
  "Urology",
  "Pain",
  "Other"
];

var developmentStages = [
  "Discovery",
  "Preclinical",
  "Phase I",
  "Phase I/II",
  "Phase II",
  "Phase II/III",
  "Phase III",
  "Regulatory Review",
  "Approved",
  "Commercial",
  "Unknown"
];

var modalities = [
  "Small Molecule",
  "Monoclonal Antibody",
  "Bispecific Antibody",
  "ADC",
  "Cell Therapy",
  "CAR-T",
  "Gene Therapy",
  "Gene Editing",
  "RNA",
  "siRNA",
  "mRNA",
  "Peptide",
  "Radiopharmaceutical",
  "Radioligand",
  "Protein Degrader",
  "PROTAC",
  "Microbiome",
  "AI Drug Discovery",
  "Precision Medicine",
  "Genomics",
  "Diagnostics",
  "Medical Device",
  "Digital Health",
  "Other"
];

var companyTypes = [
  "Big Pharma",
  "Specialty Pharma",
  "Biotech",
  "Medtech",
  "Diagnostics",
  "Healthtech",
  "Digital Health",
  "CRO",
  "CDMO",
  "Private Equity",
  "Venture Capital",
  "Other"
];

var dealStatuses = [
  "Rumoured",
  "Reported",
  "Announced",
  "Pending Regulatory Approval",
  "Pending Shareholder Approval",
  "Completed",
  "Terminated",
  "Withdrawn"
];

var dealScopes = [
  "Global",
  "Global excluding certain territories",
  "USA",
  "Europe",
  "UK",
  "China",
  "Japan",
  "Regional",
  "Selected territories",
  "Unknown"
];

var dealValueTypes = [
  "Upfront only",
  "Upfront + milestones",
  "Potential total consideration",
  "Equity value",
  "Enterprise value",
  "Undisclosed",
  "Not applicable"
];

var rationaleTags = [
  "Pipeline expansion",
  "Therapeutic area expansion",
  "Disease area expansion",
  "Geographic expansion",
  "Commercialisation",
  "Market access",
  "Technology acquisition",
  "Platform technology",
  "Manufacturing / CDMO",
  "Research collaboration",
  "Clinical development",
  "Business development",
  "Portfolio optimisation",
  "Cost / operational efficiency",
  "Vertical integration",
  "Capability expansion",
  "Strategic investment",
  "Competitive positioning",
  "Other"
];


// ======================================================
// TAXONOMY SYNONYMS
// ======================================================
// Maps the many ways the model/news describe a value
// onto a canonical taxonomy term. Anything not mapped
// is preserved and flagged, never silently discarded.

// ======================================================
// DEALS SHEET SCHEMA
// ======================================================

var DEALS_COLUMN_COUNT = 44;


// Make sure the Deals sheet has enough columns. Without
// this, getRange(...,44) throws "columns out of bounds"
// on a sheet that only had the original 33/39 columns.

function ensureDealsColumns(sheet) {

  var current =
    sheet.getMaxColumns();

  if (current < DEALS_COLUMN_COUNT) {

    sheet.insertColumnsAfter(
      current,
      DEALS_COLUMN_COUNT - current
    );

    Logger.log(
      "Deals sheet expanded from " +
      current +
      " to " +
      DEALS_COLUMN_COUNT +
      " columns."
    );
  }
}


var TAXONOMY_SYNONYMS = {

  modality: {
    "antibody-drug conjugate": "ADC",
    "antibody drug conjugate": "ADC",
    "antibody-drug conjugates": "ADC",
    "adc": "ADC",
    "adcs": "ADC",
    "bispecific antibodies": "Bispecific Antibody",
    "bispecifics": "Bispecific Antibody",
    "monoclonal antibodies": "Monoclonal Antibody",
    "mabs": "Monoclonal Antibody",
    "car t": "CAR-T",
    "cart": "CAR-T",
    "crispr": "Gene Editing",
    "ai/multimodal data": "AI Drug Discovery",
    "ai / multimodal data": "AI Drug Discovery",
    "ai drug discovery": "AI Drug Discovery",
    "radiopharmaceutical / radioligand": "Radiopharmaceutical",
    "radiopharmaceuticals": "Radiopharmaceutical",
    "radiopharmaceutical / radioligand therapy": "Radiopharmaceutical",
    "small molecules": "Small Molecule",
    "gene therapies": "Gene Therapy",
    "cell therapies": "Cell Therapy",
    "peptides": "Peptide"
  },

  therapeuticArea: {
    "cancer": "Oncology",
    "oncology": "Oncology",
    "multi-therapeutic": "Other",
    "multiple therapeutic areas": "Other",
    "metabolic disease": "Metabolic",
    "metabolic diseases": "Metabolic",
    "obesity / metabolic disease": "Obesity",
    "cardiometabolic": "Metabolic",
    "cns": "Neurology",
    "rare diseases": "Rare Disease",
    "infectious diseases": "Infectious Disease",
    "autoimmune": "Immunology"
  },

  developmentStage: {
    "phase 1": "Phase I",
    "phase 2": "Phase II",
    "phase 3": "Phase III",
    "pre-clinical": "Preclinical",
    "pre clinical": "Preclinical",
    "marketed": "Commercial",
    "filed": "Regulatory Review"
  },

  dealType: {
    "acquisitions": "Acquisition",
    "mergers": "Merger",
    "licensing agreement": "Licensing",
    "license": "Licensing",
    "collaboration": "Partnership",
    "strategic collaboration": "Partnership",
    "co-development agreement": "Co-Development",
    "co-commercialization": "Co-Commercialisation"
  },

  dealScope: {},

  dealValueType: {},

  companyType: {},

  dealStatus: {
    "rumor": "Rumoured",
    "rumour": "Rumoured",
    "rumored": "Rumoured",
    "pending": "Pending Regulatory Approval",
    "closed": "Completed"
  }
};


// ======================================================
// RESOLVE A TAXONOMY VALUE (preserve + flag)
// ======================================================

function resolveTaxonomyValue(
  value,
  allowedList,
  fieldKey
) {

  var result = {
    value: "",
    mapped: true,
    raw: ""
  };


  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return result;
  }


  var raw =
    String(value).trim();


  if (!raw) {
    return result;
  }


  result.raw = raw;


  if (
    allowedList.indexOf(raw) >= 0
  ) {
    result.value = raw;
    return result;
  }


  var synonyms =
    TAXONOMY_SYNONYMS[fieldKey] ||
    {};

  var mapped =
    synonyms[raw.toLowerCase()];


  if (
    mapped &&
    allowedList.indexOf(mapped) >= 0
  ) {
    result.value = mapped;
    return result;
  }


  // Preserve the raw value so nothing is lost, but
  // mark it as unmapped so validation can flag it.
  result.value = raw;
  result.mapped = false;

  return result;
}


function processPotentialDeals() {

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var newsSheet = ss.getSheetByName("News Feed");
  var dealsSheet = ss.getSheetByName("Deals");

  if (!newsSheet) {
    throw new Error("News Feed sheet not found.");
  }

  if (!dealsSheet) {
    throw new Error("Deals sheet not found.");
  }

  ensureDealsColumns(dealsSheet);

  var apiKey = PropertiesService
    .getScriptProperties()
    .getProperty("DEEPSEEK_API_KEY");

  if (!apiKey) {
    throw new Error("DEEPSEEK_API_KEY not found");
  }


  // ==================================================
  // TAXONOMIES
  // ==================================================
  // Defined globally at the top of this file so the
  // validation pass can reuse them.

  // ==================================================
  // LOAD NEWS FEED
  // ==================================================

  var lastNewsRow = newsSheet.getLastRow();

  if (lastNewsRow < 2) {
    Logger.log("No News Feed articles.");
    return;
  }

  var newsData = newsSheet
    .getRange(2, 1, lastNewsRow - 1, 9)
    .getValues();


  // ==================================================
  // BUILD EXISTING URL INDEX
  // ==================================================

  var existingUrls = {};
  var lastDealRow = dealsSheet.getLastRow();
  var existingDealRows = [];

  if (lastDealRow >= 2) {

    existingDealRows = dealsSheet
      .getRange(2, 1, lastDealRow - 1, 44)
      .getValues();

    for (var e = 0; e < existingDealRows.length; e++) {

      var existingUrl = existingDealRows[e][24];

      if (existingUrl) {
        existingUrls[
          normaliseUrl(existingUrl)
        ] = e + 2;
      }
    }
  }


  // ==================================================
  // BUILD CROSS-SOURCE DEAL INDEX
  // ==================================================

  var existingDealIndex = {};

  for (var d = 0; d < existingDealRows.length; d++) {

    var existingBuyer =
      existingDealRows[d][2] || "";

    var existingTarget =
      existingDealRows[d][4] || "";

    var existingType =
      existingDealRows[d][6] || "";

    var existingDate =
      existingDealRows[d][1];

    var keys = makeDealKeys(
      existingBuyer,
      existingTarget,
      existingType
    );

    for (var k = 0; k < keys.length; k++) {

      if (!existingDealIndex[keys[k]]) {
        existingDealIndex[keys[k]] = [];
      }

      existingDealIndex[keys[k]].push({
        row: d + 2,
        date: existingDate,
        buyer: existingBuyer,
        target: existingTarget,
        dealType: existingType
      });
    }
  }


  var processedCount = 0;
  var dealsAdded = 0;
  var dealsUpdated = 0;
  var deferred = 0;

  var startedAt =
    new Date().getTime();

  var budgetMs =
    getRuntimeBudgetMs();


  // ==================================================
  // PROCESS FLAGGED ARTICLES
  // ==================================================

  for (var i = 0; i < newsData.length; i++) {

    var newsRow = i + 2;
    var row = newsData[i];

    var articleDate = row[1];
    var source = row[2];
    var headline = row[3];
    var url = row[4];
    var description = row[5];
    var keyword = row[6];
    var processed = row[7];

    // The exact text the extraction was based on, kept
    // for auditing.
    var evidenceSnippet =
      String(headline || "").trim() +
      (
        description
          ? " — " +
            String(description)
              .trim()
              .substring(0, 300)
          : ""
      );

    if (keyword !== "Potential Deal") {
      continue;
    }

    if (
      processed === true ||
      String(processed).toUpperCase() === "TRUE"
    ) {
      continue;
    }

    Logger.log(
      "Processing row " +
      newsRow +
      ": " +
      headline
    );


    // ==================================================
    // DEEPSEEK CLASSIFICATION + EXTRACTION PROMPT
    // ==================================================

    var prompt =
      "You are a life sciences M&A and business development analyst.\n\n" +

      "Determine whether this article describes a MATERIAL STRATEGIC TRANSACTION involving a pharmaceutical, biotechnology, medical technology, diagnostics, healthcare or life sciences company.\n\n" +

      "INCLUDE:\n" +
      "- acquisitions\n" +
      "- mergers\n" +
      "- asset acquisitions\n" +
      "- divestitures\n" +
      "- licensing and commercial rights transactions\n" +
      "- co-development agreements\n" +
      "- co-commercialisation agreements\n" +
      "- material strategic partnerships\n" +
      "- joint ventures\n" +
      "- option agreements\n" +
      "- strategic investments\n" +
      "- venture investments and material financing rounds\n\n" +

      "IMPORTANT PARTNERSHIP / CDMO / CRO RULE:\n" +
      "Do NOT include routine supplier, customer, manufacturing, testing, evaluation, pilot, feasibility, automation-test, CRO or CDMO service agreements. " +
      "Do NOT classify a relationship as a strategic deal merely because the article uses words such as partnership, collaboration or partner. " +
      "Only include these relationships when the article clearly describes a material strategic commitment such as substantial economics, asset or technology rights, co-development, co-commercialisation, a dedicated facility, a major long-term capability expansion, or another strategically significant transaction.\n\n" +

      "VENTURE FINANCING RULE:\n" +
      "A material venture financing round can be a qualifying Venture Investment. " +
      "If the article does not identify a lead investor or specific investor, leave buyer blank rather than inventing one. " +
      "The funded company should be the target.\n\n" +

      "EXCLUDE:\n" +
      "- government contracts\n" +
      "- grants\n" +
      "- routine supplier contracts\n" +
      "- ordinary customer contracts\n" +
      "- routine testing or evaluation partnerships\n" +
      "- routine CDMO/CRO contracts\n" +
      "- clinical trial results\n" +
      "- regulatory approvals\n" +
      "- scientific discoveries\n" +
      "- research publications\n" +
      "- earnings reports\n" +
      "- personnel announcements\n" +
      "- ordinary business updates\n" +
      "- articles merely referring to a historical deal without announcing a new transaction or material change to that transaction\n\n" +

      "DATA QUALITY RULES:\n" +
      "Do not invent company names, financial information, countries, stages, assets or indications. " +
      "If an article only says something generic such as 'a Chinese biotech' and does not name the company, leave the target blank. " +
      "Do not use generic descriptions such as 'specialist Chinese biotech' as a company name. " +
      "Do not confuse buyer country or target country with deal scope. " +
      "For acquisitions and asset purchases, buyer means the acquiring company and target means the acquired company or seller/asset owner as appropriate. " +
      "For a divestiture, buyer should still be the acquiring company and target should be the seller when the article is framed as one company acquiring rights/assets from another. " +
      "Leave fields blank when genuinely not applicable or not stated.\n\n" +

      "FINANCIAL VALUE RULES:\n" +
      "For deal_value, upfront_value and milestone_value, return the value exactly as stated in the article text. " +
      "Examples: '$1.65 billion', '$311 million', 'up to $900 million'. " +
      "Do not silently change millions into raw dollars. The script will standardise the numeric values later.\n\n" +

      "Allowed Deal Types: " +
      JSON.stringify(dealTypes) + "\n" +

      "Allowed Therapeutic Areas: " +
      JSON.stringify(therapeuticAreas) + "\n" +

      "Allowed Development Stages: " +
      JSON.stringify(developmentStages) + "\n" +

      "Allowed Modalities: " +
      JSON.stringify(modalities) + "\n" +

      "Allowed Buyer/Target Types: " +
      JSON.stringify(companyTypes) + "\n" +

      "Allowed Deal Statuses: " +
      JSON.stringify(dealStatuses) + "\n" +

      "Allowed Deal Scopes: " +
      JSON.stringify(dealScopes) + "\n" +

      "Allowed Deal Value Types: " +
      JSON.stringify(dealValueTypes) + "\n" +

      "Allowed Strategic Rationale Tags: " +
      JSON.stringify(rationaleTags) + "\n\n" +

      "ARTICLE:\n" +
      "Headline: " + headline + "\n" +
      "Description: " + description + "\n" +
      "Source: " + source + "\n" +
      "Date: " + articleDate + "\n" +
      "URL: " + url + "\n\n" +

      "Return ONLY valid JSON.\n\n" +

      "If this is NOT a qualifying deal, return:\n" +
      "{\"deal\":false,\"confidence\":0,\"reason\":\"\"}\n\n" +

      "If this IS a qualifying deal, return exactly these fields:\n" +
      "{\"deal\":true,\"confidence\":0,\"buyer\":\"\",\"buyer_type\":\"\",\"target\":\"\",\"target_type\":\"\",\"deal_type\":\"\",\"deal_status\":\"\",\"deal_scope\":\"\",\"deal_value\":\"\",\"upfront_value\":\"\",\"milestone_value\":\"\",\"currency\":\"\",\"therapeutic_area\":\"\",\"disease_area\":\"\",\"indication\":\"\",\"modality\":\"\",\"development_stage\":\"\",\"lead_asset\":\"\",\"strategic_rationale\":\"\",\"strategic_rationale_tags\":\"\",\"buyer_country\":\"\",\"target_country\":\"\",\"source\":\"\",\"source_url\":\"\",\"source_date\":\"\",\"deal_value_type\":\"\",\"ai_summary\":\"\"}";

    var payload = {
      model: "deepseek-chat",

      messages: [
        {
          role: "system",
          content:
            "You are a precise life sciences M&A analyst. " +
            "Be conservative, factual and consistent. " +
            "Never invent missing information. " +
            "Return valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],

      response_format: {
        type: "json_object"
      },

      temperature: 0.1,
      max_tokens: 2500
    };


    // Stop before exceeding the execution limit. Each
    // article is marked processed as we go, so the next
    // run resumes from the first unprocessed article.
    if (
      new Date().getTime() - startedAt >
      budgetMs
    ) {

      for (
        var r = i;
        r < newsData.length;
        r++
      ) {

        var remainingProcessed =
          newsData[r][7];

        if (
          newsData[r][6] === "Potential Deal" &&
          !(
            remainingProcessed === true ||
            String(remainingProcessed)
              .toUpperCase() === "TRUE"
          )
        ) {
          deferred++;
        }
      }


      Logger.log(
        "Runtime budget reached at row " +
        newsRow +
        ". " +
        deferred +
        " flagged article(s) deferred to the next run."
      );

      break;
    }


    var response;

    try {

      response = UrlFetchApp.fetch(
        "https://api.deepseek.com/chat/completions",
        {
          method: "post",

          contentType: "application/json",

          headers: {
            Authorization: "Bearer " + apiKey
          },

          payload: JSON.stringify(payload),

          muteHttpExceptions: true
        }
      );

    } catch (requestError) {

      Logger.log(
        "DeepSeek request failed for row " +
        newsRow +
        ": " +
        requestError.message
      );

      continue;
    }


    var statusCode =
      response.getResponseCode();

    Logger.log(
      "DeepSeek HTTP status: " +
      statusCode
    );


    if (statusCode !== 200) {

      Logger.log(
        "DeepSeek error: " +
        response.getContentText()
      );

      continue;
    }


    var parsed;

    try {

      var apiResult =
        JSON.parse(
          response.getContentText()
        );

      var content =
        apiResult.choices[0]
          .message.content;

      parsed =
        JSON.parse(content);

    } catch (error) {

      Logger.log(
        "Could not parse DeepSeek response for row " +
        newsRow
      );

      Logger.log(
        response.getContentText()
      );

      continue;
    }


    Logger.log(
      "Deal decision: " +
      parsed.deal
    );


    // Mark article as processed only after we
    // successfully received and parsed the response.
    newsSheet
      .getRange(newsRow, 8)
      .setValue(true);

    newsSheet
      .getRange(newsRow, 9)
      .setValue(
        parsed.deal === true
      );

    processedCount++;


    if (parsed.deal !== true) {
      continue;
    }


    // ==================================================
    // CLEAN TAXONOMY VALUES
    // ==================================================

    function cleanField(
      value,
      allowedList,
      fieldKey
    ) {

      // Map known synonyms onto canonical terms;
      // preserve anything else so it can be flagged
      // during validation rather than silently lost.
      return resolveTaxonomyValue(
        value,
        allowedList,
        fieldKey
      ).value;
    }


    var cleanDealType =
      cleanField(
        parsed.deal_type,
        dealTypes,
        "dealType"
      );


    var cleanBuyerType =
      cleanField(
        parsed.buyer_type,
        companyTypes,
        "companyType"
      );


    var cleanTargetType =
      cleanField(
        parsed.target_type,
        companyTypes,
        "companyType"
      );


    var cleanStatus =
      cleanField(
        parsed.deal_status,
        dealStatuses,
        "dealStatus"
      );


    var cleanTherapeuticArea =
      cleanField(
        parsed.therapeutic_area,
        therapeuticAreas,
        "therapeuticArea"
      );


    var cleanModality =
      cleanField(
        parsed.modality,
        modalities,
        "modality"
      );


    var cleanStage =
      cleanField(
        parsed.development_stage,
        developmentStages,
        "developmentStage"
      );


    var cleanScope =
      cleanField(
        parsed.deal_scope,
        dealScopes,
        "dealScope"
      );


    if (!cleanScope) {
      cleanScope = "Unknown";
    }


    var cleanValueType =
      cleanField(
        parsed.deal_value_type,
        dealValueTypes,
        "dealValueType"
      );


    // ==================================================
    // STANDARDISE FINANCIAL VALUES
    // ==================================================

    var dealValueDetails =
      parseMoneyDetails(
        parsed.deal_value
      );

    var upfrontValueDetails =
      parseMoneyDetails(
        parsed.upfront_value
      );

    var milestoneValueDetails =
      parseMoneyDetails(
        parsed.milestone_value
      );


    var numericDealValue =
      dealValueDetails.value;

    var numericUpfrontValue =
      upfrontValueDetails.value;

    var numericMilestoneValue =
      milestoneValueDetails.value;


    // Keep the model's original wording so an
    // ambiguous or unit-less value can still be
    // shown and audited.
    var valueRawText =
      [
        dealValueDetails.raw,
        upfrontValueDetails.raw,
        milestoneValueDetails.raw
      ]
        .filter(function(part) {
          return part;
        })
        .join(" | ");


    if (!cleanValueType) {

      if (
        numericUpfrontValue !== "" &&
        numericMilestoneValue !== ""
      ) {

        cleanValueType =
          "Upfront + milestones";

      } else if (
        numericUpfrontValue !== ""
      ) {

        cleanValueType =
          "Upfront only";

      } else if (
        cleanDealType ===
        "Venture Investment" &&
        numericDealValue !== ""
      ) {

        cleanValueType =
          "Equity value";

      } else if (
        numericDealValue !== ""
      ) {

        cleanValueType =
          "Potential total consideration";

      } else if (
        cleanDealType === "Partnership" ||
        cleanDealType === "Co-Development" ||
        cleanDealType === "Co-Commercialisation" ||
        cleanDealType === "Joint Venture"
      ) {

        cleanValueType =
          "Not applicable";

      } else {

        cleanValueType =
          "Undisclosed";
      }
    }


    // ==================================================
    // CLEAN COMPANY NAMES
    // ==================================================

    var cleanBuyerName =
      cleanExtractedCompanyName(
        parsed.buyer
      );

    var cleanTargetName =
      cleanExtractedCompanyName(
        parsed.target
      );


    // Venture rounds may legitimately have no named
    // lead investor. Do not manufacture a buyer.
    if (
      cleanDealType ===
      "Venture Investment" &&
      !cleanBuyerName
    ) {

      cleanBuyerType =
        "Venture Capital";
    }


    // ==================================================
    // SOURCE URL
    // ==================================================

    var finalUrl =
      url ||
      parsed.source_url ||
      "";

    var normalisedFinalUrl =
      normaliseUrl(finalUrl);


    // ==================================================
    // DEAL DATE
    // ==================================================

    var dealDate =
      safeDate(articleDate);

    if (
      parsed.source_date
    ) {

      var parsedSourceDate =
        safeDate(
          parsed.source_date
        );

      if (parsedSourceDate) {
        dealDate =
          parsedSourceDate;
      }
    }


    if (!dealDate) {
      dealDate =
        new Date();
    }


    // ==================================================
    // EXACT URL DUPLICATE CHECK
    // ==================================================

    var existingRow =
      normalisedFinalUrl
        ? existingUrls[
            normalisedFinalUrl
          ]
        : null;


    // ==================================================
    // CROSS-SOURCE DUPLICATE CHECK
    // ==================================================

    if (!existingRow) {

      existingRow =
        findMatchingDealRow(
          cleanBuyerName,
          cleanTargetName,
          cleanDealType,
          dealDate,
          existingDealIndex
        );
    }


    if (existingRow) {

      // Respect manually locked rows: never overwrite or
      // merge into a deal a human has locked.
      var lockedValue =
        existingDealRows[existingRow - 2]
          ? existingDealRows[existingRow - 2][43]
          : "";

      if (
        lockedValue === true ||
        String(lockedValue).toUpperCase() === "TRUE"
      ) {

        Logger.log(
          "SKIPPING LOCKED DEAL row " +
          existingRow
        );

        continue;
      }

  Logger.log(
    "EXISTING DEAL MATCH FOUND: " +
    cleanBuyerName +
    " / " +
    cleanTargetName +
    " -> row " +
    existingRow
  );

  // ----------------------------------
  // CROSS-SOURCE CORROBORATION
  // ----------------------------------

  var existingPrimaryUrl =
    String(
      dealsSheet
        .getRange(existingRow, 25)
        .getValue() || ""
    ).trim();

  var newSourceUrl =
    String(finalUrl || "").trim();

  // Only count it as corroboration when
  // this is genuinely a different article.
  if (
    newSourceUrl &&
    normaliseUrl(newSourceUrl) !==
      normaliseUrl(existingPrimaryUrl)
  ) {

    addCorroboratingSource(
      dealsSheet,
      existingRow,
      source,
      newSourceUrl,
      existingPrimaryUrl
    );

    Logger.log(
      "CORROBORATING SOURCE ADDED: " +
      source
    );
  }
}


    // ==================================================
    // DEAL ID
    // ==================================================

    var dealId;

    if (existingRow) {

      dealId =
        dealsSheet
          .getRange(
            existingRow,
            1
          )
          .getValue();

    } else {

      dealId =
        "DEAL-" +
        Utilities.formatDate(
          new Date(),
          Session.getScriptTimeZone(),
          "yyyyMMdd"
        ) +
        "-" +
        Utilities.getUuid()
          .substring(0, 8);
    }


    // ==================================================
    // WHEN UPDATING, PRESERVE BETTER EXISTING DATA
    // ==================================================

    var existingData = null;

    if (existingRow) {

      existingData =
        dealsSheet
          .getRange(
            existingRow,
            1,
            1,
            33
          )
          .getValues()[0];
    }


    var finalBuyer =
      chooseBetterValue(
        cleanBuyerName,
        existingData
          ? existingData[2]
          : ""
      );


    var finalBuyerType =
      chooseBetterValue(
        cleanBuyerType,
        existingData
          ? existingData[3]
          : ""
      );


    var finalTarget =
      chooseBetterValue(
        cleanTargetName,
        existingData
          ? existingData[4]
          : ""
      );


    var finalTargetType =
      chooseBetterValue(
        cleanTargetType,
        existingData
          ? existingData[5]
          : ""
      );


    var finalDealType =
      choosePreferredDealType(
        cleanDealType,
        existingData
          ? existingData[6]
          : ""
      );


    var finalStatus =
      chooseBetterValue(
        cleanStatus,
        existingData
          ? existingData[7]
          : ""
      );


    var finalScope =
      chooseBetterValue(
        cleanScope,
        existingData
          ? existingData[8]
          : ""
      );


    var finalDealValue =
      chooseMoneyValue(
        numericDealValue,
        existingData
          ? existingData[9]
          : ""
      );


    var finalUpfrontValue =
      chooseMoneyValue(
        numericUpfrontValue,
        existingData
          ? existingData[10]
          : ""
      );


    var finalMilestoneValue =
      chooseMoneyValue(
        numericMilestoneValue,
        existingData
          ? existingData[11]
          : ""
      );


    var finalCurrency =
      chooseBetterValue(
        parsed.currency,
        existingData
          ? existingData[12]
          : ""
      );


    var finalTherapeuticArea =
      chooseBetterValue(
        cleanTherapeuticArea,
        existingData
          ? existingData[13]
          : ""
      );


    var finalDiseaseArea =
      chooseBetterValue(
        parsed.disease_area,
        existingData
          ? existingData[14]
          : ""
      );


    var finalIndication =
      chooseBetterValue(
        parsed.indication,
        existingData
          ? existingData[15]
          : ""
      );


    var finalModality =
      chooseBetterValue(
        cleanModality,
        existingData
          ? existingData[16]
          : ""
      );


    var finalStage =
      chooseBetterValue(
        cleanStage,
        existingData
          ? existingData[17]
          : ""
      );


    var finalLeadAsset =
      chooseBetterValue(
        parsed.lead_asset,
        existingData
          ? existingData[18]
          : ""
      );


    var finalRationale =
      chooseBetterValue(
        parsed.strategic_rationale,
        existingData
          ? existingData[19]
          : ""
      );


    var finalRationaleTags =
      mergeTags(
        existingData
          ? existingData[20]
          : "",
        parsed.strategic_rationale_tags
      );


    var finalBuyerCountry =
      chooseBetterValue(
        parsed.buyer_country,
        existingData
          ? existingData[21]
          : ""
      );


    var finalTargetCountry =
      chooseBetterValue(
        parsed.target_country,
        existingData
          ? existingData[22]
          : ""
      );


    var finalConfidence =
      chooseHigherConfidence(
        parsed.confidence,
        existingData
          ? existingData[27]
          : ""
      );


    var finalSummary =
      chooseBetterValue(
        parsed.ai_summary,
        existingData
          ? existingData[28]
          : ""
      );


    // ==================================================
    // PRESERVE ORIGINAL DATES ON UPDATE
    // ==================================================
    // An existing deal can be matched again by a later
    // article. Keep the earliest announcement/source date
    // instead of overwriting it with the newest article.

    var finalDealDate =
      existingData
        ? chooseEarlierDate(
            dealDate,
            existingData[1]
          )
        : dealDate;

    var finalSourceDate =
      existingData
        ? chooseEarlierDate(
            dealDate,
            existingData[25]
          )
        : dealDate;


    // ==================================================
    // BUILD 30-COLUMN DEAL ROW
    // ==================================================

    var dealData = [

      dealId,

      finalDealDate,

      finalBuyer,

      finalBuyerType,

      finalTarget,

      finalTargetType,

      finalDealType,

      finalStatus,

      finalScope,

      finalDealValue,

      finalUpfrontValue,

      finalMilestoneValue,

      finalCurrency,

      finalTherapeuticArea,

      finalDiseaseArea,

      finalIndication,

      finalModality,

      finalStage,

      finalLeadAsset,

      finalRationale,

      finalRationaleTags,

      finalBuyerCountry,

      finalTargetCountry,

      source || "",

      finalUrl,

      finalSourceDate,

      new Date(),

      finalConfidence,

      finalSummary,

      existingData
        ? existingData[29]
        : ""
    ];
        // ==================================================
    // WRITE / UPDATE DEAL
    // ==================================================

    if (existingRow) {

      dealsSheet
        .getRange(
          existingRow,
          1,
          1,
          30
        )
        .setValues([
          dealData
        ]);


      dealsSheet
        .getRange(
          existingRow,
          31
        )
        .setFormula(
          "=YEAR(B" +
          existingRow +
          ")"
        );


      dealsSheet
        .getRange(
          existingRow,
          32
        )
        .setFormula(
          '=TEXT(B' +
          existingRow +
          ',"mmm")'
        );


      dealsSheet
        .getRange(
          existingRow,
          33
        )
        .setValue(
          cleanValueType
        );


      // AL — lock in the original primary source URL.
      ensurePrimarySourceUrl(
        dealsSheet,
        existingRow,
        existingPrimaryUrl || finalUrl
      );


      // AP / AQ — keep the original raw value wording
      // and evidence snippet once they are set.
      setIfEmpty(
        dealsSheet,
        existingRow,
        42,
        valueRawText
      );

      setIfEmpty(
        dealsSheet,
        existingRow,
        43,
        evidenceSnippet
      );


      if (normalisedFinalUrl) {
        existingUrls[
          normalisedFinalUrl
        ] = existingRow;
      }


      // Add the updated names back into the index.
      // This means later articles in the SAME run can
      // recognise this deal too.
      addDealToIndex(
        existingDealIndex,
        finalBuyer,
        finalTarget,
        finalDealType,
        dealDate,
        existingRow
      );


      Logger.log(
        "DEAL UPDATED: " +
        finalBuyer +
        " / " +
        finalTarget
      );

      dealsUpdated++;


    } else {

      var newRow =
        dealsSheet.getLastRow() + 1;


      dealsSheet
        .getRange(
          newRow,
          1,
          1,
          30
        )
        .setValues([
          dealData
        ]);


      dealsSheet
        .getRange(
          newRow,
          31
        )
        .setFormula(
          "=YEAR(B" +
          newRow +
          ")"
        );


      dealsSheet
        .getRange(
          newRow,
          32
        )
        .setFormula(
          '=TEXT(B' +
          newRow +
          ',"mmm")'
        );


      dealsSheet
        .getRange(
          newRow,
          33
        )
        .setValue(
          cleanValueType
        );


      // AL — first-seen article becomes the primary source.
      ensurePrimarySourceUrl(
        dealsSheet,
        newRow,
        finalUrl
      );


      // AP / AQ — raw value wording and evidence snippet.
      setIfEmpty(
        dealsSheet,
        newRow,
        42,
        valueRawText
      );

      setIfEmpty(
        dealsSheet,
        newRow,
        43,
        evidenceSnippet
      );


      if (normalisedFinalUrl) {
        existingUrls[
          normalisedFinalUrl
        ] = newRow;
      }


      addDealToIndex(
        existingDealIndex,
        finalBuyer,
        finalTarget,
        finalDealType,
        dealDate,
        newRow
      );


      Logger.log(
        "DEAL ADDED: " +
        finalBuyer +
        " / " +
        finalTarget
      );

      dealsAdded++;
    }
  }


  Logger.log(
    "Finished. Articles processed: " +
    processedCount +
    ". Deals added: " +
    dealsAdded +
    ". Deals updated: " +
    dealsUpdated
  );


  return {
    processed: processedCount,
    added: dealsAdded,
    updated: dealsUpdated,
    deferred: deferred
  };
}


// ======================================================
// FETCH NEWS FEEDS
// ======================================================

function fetchNewsFeeds() {

  var ss =
    SpreadsheetApp
      .getActiveSpreadsheet();

  var sheet =
    ss.getSheetByName(
      "News Feed"
    );

  if (!sheet) {
    throw new Error(
      "News Feed sheet not found."
    );
  }


  var feeds =
    getActiveFeeds()
      .concat(
        getGoogleNewsFeeds()
      );


  if (!feeds.length) {
    throw new Error(
      "No active sources found. " +
      "Add feeds to the Sources sheet."
    );
  }


  // ==================================================
  // EXISTING URL + HEADLINE INDEX
  // ==================================================

  var existingUrls = {};
  var existingHeadlines = {};

  var lastRow =
    sheet.getLastRow();


  if (lastRow >= 2) {

    var existingData =
      sheet
        .getRange(
          2,
          1,
          lastRow - 1,
          9
        )
        .getValues();


    for (
      var i = 0;
      i < existingData.length;
      i++
    ) {

      var oldHeadline =
        existingData[i][3];

      var oldUrl =
        existingData[i][4];


      if (oldHeadline) {

        existingHeadlines[
          normaliseHeadline(
            oldHeadline
          )
        ] = true;
      }


      if (oldUrl) {

        existingUrls[
          normaliseUrl(
            oldUrl
          )
        ] = true;
      }
    }
  }


  var articlesAdded = 0;

  var fetchStartedAt =
    new Date().getTime();

  var fetchBudgetMs =
    getRuntimeBudgetMs();


  // ==================================================
  // FETCH EACH RSS FEED
  // ==================================================

  for (
    var f = 0;
    f < feeds.length;
    f++
  ) {

    var feed =
      feeds[f];


    if (
      new Date().getTime() -
        fetchStartedAt >
      fetchBudgetMs
    ) {

      Logger.log(
        "Feed fetch budget reached; remaining feeds skipped."
      );

      break;
    }


    try {

      Logger.log(
        "Fetching: " +
        feed.source
      );


      var response =
        UrlFetchApp.fetch(
          feed.url,
          {
            muteHttpExceptions:
              true,

            followRedirects:
              true
          }
        );


      var status =
        response.getResponseCode();


      Logger.log(
        feed.source +
        " HTTP status: " +
        status
      );


      if (status !== 200) {
        continue;
      }


      var xml =
        response.getContentText();

      var document =
        XmlService.parse(xml);

      var root =
        document.getRootElement();

      var channel =
        root.getChild(
          "channel"
        );


      if (!channel) {

        Logger.log(
          "No RSS channel: " +
          feed.source
        );

        continue;
      }


      var items =
        channel.getChildren(
          "item"
        );


      Logger.log(
        feed.source +
        " articles found: " +
        items.length
      );


      for (
        var j = 0;
        j < items.length;
        j++
      ) {

        var item =
          items[j];


        // ==============================================
        // TITLE
        // ==============================================

        var headline = "";

        var titleElement =
          item.getChild(
            "title"
          );


        if (titleElement) {

          headline =
            titleElement.getValue() ||
            titleElement.getText() ||
            "";
        }


        headline =
          String(headline)
            .trim();


        // ==============================================
        // URL
        // ==============================================

        var articleUrl = "";

        var linkElement =
          item.getChild(
            "link"
          );


        if (linkElement) {

          articleUrl =
            linkElement.getValue() ||
            linkElement.getText() ||
            "";
        }


        articleUrl =
          String(articleUrl)
            .trim();


        if (!articleUrl) {
          continue;
        }


        // ==============================================
        // DESCRIPTION
        // ==============================================

        var description = "";

        var descriptionElement =
          item.getChild(
            "description"
          );


        if (descriptionElement) {

          description =
            descriptionElement.getValue() ||
            descriptionElement.getText() ||
            "";
        }


        description =
          String(description)
            .replace(
              /<[^>]*>/g,
              " "
            )
            .replace(
              /&nbsp;/g,
              " "
            )
            .replace(
              /&amp;/g,
              "&"
            )
            .replace(
              /&#39;/g,
              "'"
            )
            .replace(
              /&quot;/g,
              '"'
            )
            .replace(
              /\s+/g,
              " "
            )
            .trim();


        // ==============================================
        // ARTICLE DATE
        // ==============================================

        var articleDate =
          extractRssDate(item);


        if (!articleDate) {

          // We prefer a real RSS date, but if the feed
          // genuinely gives us none, use ingestion time.
          articleDate =
            new Date();
        }


        // ==============================================
        // DUPLICATE ARTICLE CHECK
        // ==============================================

        var cleanUrl =
          normaliseUrl(
            articleUrl
          );

        var cleanHeadline =
          normaliseHeadline(
            headline
          );


        if (
          cleanUrl &&
          existingUrls[cleanUrl]
        ) {
          continue;
        }


        if (
          cleanHeadline &&
          existingHeadlines[
            cleanHeadline
          ]
        ) {
          continue;
        }


        // ==============================================
        // ADD ARTICLE
        // ==============================================

        var articleId =
          "SRC-" +
          Utilities
            .getUuid()
            .substring(
              0,
              8
            );


        sheet.appendRow([
          articleId,
          articleDate,
          feed.source,
          headline,
          articleUrl,
          description,
          "",
          false,
          ""
        ]);


        if (cleanUrl) {
          existingUrls[
            cleanUrl
          ] = true;
        }


        if (cleanHeadline) {

          existingHeadlines[
            cleanHeadline
          ] = true;
        }


        articlesAdded++;
      }


    } catch (error) {

      Logger.log(
        "ERROR fetching " +
        feed.source +
        ": " +
        error.message
      );
    }
  }


  Logger.log(
    "Finished. New articles added: " +
    articlesAdded
  );


  PropertiesService
    .getScriptProperties()
    .setProperty(
      "LAST_FEED_FETCH",
      String(new Date().getTime())
    );


  return {
    feeds: feeds.length,
    added: articlesAdded
  };
}


// ======================================================
// ACTIVE FEEDS FROM THE SOURCES SHEET
// ======================================================

function getActiveFeeds() {

  var ss =
    SpreadsheetApp
      .getActiveSpreadsheet();

  var sheet =
    ss.getSheetByName("Sources");


  if (!sheet) {
    return getDefaultFeeds();
  }


  var lastRow =
    sheet.getLastRow();

  if (lastRow < 2) {
    return getDefaultFeeds();
  }


  var rows =
    sheet
      .getRange(
        2,
        1,
        lastRow - 1,
        6
      )
      .getValues();


  var feeds = [];


  rows.forEach(function(row) {

    var name =
      String(row[1] || "").trim();

    var type =
      String(row[2] || "")
        .trim()
        .toLowerCase();

    var url =
      String(row[3] || "").trim();

    var active =
      row[5] === true ||
      String(row[5])
        .toUpperCase() === "TRUE";


    // Only RSS feeds, active, and with a URL.
    if (
      active &&
      url &&
      type.indexOf("rss") >= 0
    ) {

      feeds.push({
        source: name || "Unknown",
        url: url
      });
    }
  });


  return feeds.length
    ? feeds
    : getDefaultFeeds();
}


function getDefaultFeeds() {

  return [
    {
      source: "Fierce Pharma",
      url: "https://www.fiercepharma.com/rss/xml"
    },
    {
      source: "Fierce Biotech",
      url: "https://www.fiercebiotech.com/rss/xml"
    },
    {
      source: "BioPharma Dive",
      url: "https://www.biopharmadive.com/feeds/news/"
    },
    {
      source: "STAT Biotech",
      url: "https://www.statnews.com/category/biotech/feed/"
    },
    {
      source: "GEN",
      url: "https://www.genengnews.com/feed/"
    }
  ];
}


// ======================================================
// GOOGLE NEWS SEARCH FEEDS
// ======================================================
// Broadens coverage beyond the handful of publishers.
// Edit the queries in Script Properties (key
// GOOGLE_NEWS_QUERIES, pipe-separated) or leave blank
// to use the defaults.

function getGoogleNewsFeeds() {

  var configured =
    PropertiesService
      .getScriptProperties()
      .getProperty(
        "GOOGLE_NEWS_QUERIES"
      );


  var queries =
    configured &&
    configured.trim().toLowerCase() === "none"
      ? []
      : configured
        ? configured.split("|")
        : [
            "biotech acquisition",
            "pharma acquisition",
            "biotech licensing agreement",
            "pharma licensing deal",
            "biotech merger",
            "life sciences asset acquisition",
            "biotech collaboration"
          ];


  return queries
    .map(function(query) {

      var trimmed =
        String(query).trim();

      if (!trimmed) {
        return null;
      }

      return {
        source: "Google News",
        url:
          "https://news.google.com/rss/search?q=" +
          encodeURIComponent(trimmed) +
          "&hl=en-GB&gl=GB&ceid=GB:en"
      };

    })
    .filter(function(feed) {
      return !!feed;
    });
}


// ======================================================
// FLAG POTENTIAL DEALS
// ======================================================

function flagPotentialDeals() {

  var ss =
    SpreadsheetApp
      .getActiveSpreadsheet();

  var sheet =
    ss.getSheetByName(
      "News Feed"
    );


  if (!sheet) {

    throw new Error(
      "News Feed sheet not found."
    );
  }


  var lastRow =
    sheet.getLastRow();


  if (lastRow < 2) {

    Logger.log(
      "No articles found."
    );

    return {
      seen: 0,
      alreadyProcessed: 0,
      flagged: 0
    };
  }


  var data =
    sheet
      .getRange(
        2,
        1,
        lastRow - 1,
        9
      )
      .getValues();


  var dealPattern =
    /\b(acquire|acquires|acquired|acquiring|acquisition|buy|buys|bought|buying|purchase|purchases|purchased|purchasing|merger|merge|merges|merged|merging|buyout|takeover|take over|takes over|take-private|take private|snaps up|snap up|offload|offloads|offloaded|divest|divests|divested|divestiture|asset acquisition|asset sale|portfolio sale|sell|sells|sold|sale of|to sell|spin off|spin-off|spinoff|carve out|carve-out|carveout|license|licenses|licensed|licensing|in-license|out-license|license agreement|commercial rights|option agreement|option|partnership|partners|partnered|collaboration|collaborates|collaborate|strategic alliance|alliance|ties up|teams up|joins forces|pact|co-development|co-develop|co-commercialisation|co-commercialization|joint venture|strategic investment|invests in|investment in|stake in|stake|majority stake|controlling stake|financing|funding|raises|raised|raise|series a|series b|series c|series d|series e|definitive agreement|all-stock|all stock)\b/i;


  var seen = 0;
  var alreadyProcessed = 0;
  var flagged = 0;


  for (
    var i = 0;
    i < data.length;
    i++
  ) {

    var rowNumber =
      i + 2;

    var headline =
      data[i][3] || "";

    var description =
      data[i][5] || "";

    var processed =
      data[i][7];


    // Never re-flag something already
    // processed by DeepSeek.
    if (
      processed === true ||
      String(processed)
        .toUpperCase() ===
        "TRUE"
    ) {
      alreadyProcessed++;
      continue;
    }


    seen++;


    var text =
      String(headline) +
      " " +
      String(description);


    if (
      dealPattern.test(text)
    ) {

      sheet
        .getRange(
          rowNumber,
          7
        )
        .setValue(
          "Potential Deal"
        );


      flagged++;


      Logger.log(
        "FLAGGED row " +
        rowNumber +
        ": " +
        headline
      );
    }
  }


  Logger.log(
    "Finished. Potential deals flagged: " +
    flagged
  );


  return {
    seen: seen,
    alreadyProcessed: alreadyProcessed,
    flagged: flagged
  };
}

// ============================================================
// DATA QUALITY + VALIDATION
// ============================================================

// ============================================================
// VALIDATION MODEL
// ============================================================
// Three independent dimensions instead of one opaque score:
//   - Completeness -> getMissingFields()
//   - Provenance   -> getValidationTier()
//   - Consistency  -> getConsistencyIssues()
// plus a single action-oriented review state.

var EXPECTED_FIELDS = [
  { key: "buyer", label: "Buyer" },
  { key: "target", label: "Target" },
  { key: "dealType", label: "Deal Type" },
  { key: "dealStatus", label: "Deal Status" },
  { key: "dealScope", label: "Deal Scope" },
  { key: "therapeuticArea", label: "Therapeutic Area" },
  { key: "modality", label: "Modality" },
  { key: "developmentStage", label: "Development Stage" },
  { key: "dealValueType", label: "Deal Value Type" },
  { key: "source", label: "Source" },
  { key: "sourceUrl", label: "Source URL" },
  { key: "sourceDate", label: "Source Date" },
  { key: "strategicRationale", label: "Strategic Rationale" }
];


function hasValue(value) {

  return !(
    value === null ||
    value === undefined ||
    String(value).trim() === ""
  );
}


// ------------------------------------------------------------
// COMPLETENESS
// ------------------------------------------------------------

function getMissingFields(deal) {

  var missing = [];

  EXPECTED_FIELDS.forEach(function(field) {

    if (hasValue(deal[field.key])) {
      return;
    }

    // A venture round legitimately may have no
    // named lead investor.
    if (
      field.key === "buyer" &&
      deal.dealType === "Venture Investment"
    ) {
      return;
    }

    missing.push(field.label);
  });


  // Currency is only expected when money is stated.
  if (
    (
      hasValue(deal.dealValue) ||
      hasValue(deal.upfrontValue) ||
      hasValue(deal.milestoneValue)
    ) &&
    !hasValue(deal.currency)
  ) {
    missing.push("Currency");
  }


  return missing;
}


// ------------------------------------------------------------
// PROVENANCE / VERIFICATION TIER
// ------------------------------------------------------------

function getValidationTier(deal) {

  var sourceCount =
    Number(deal.sourceCount || 1);

  var primary =
    hasValue(deal.primarySourceUrl);

  var hasUrl =
    hasValue(deal.sourceUrl);


  if (primary && sourceCount >= 2) {
    return "Verified";
  }

  if (sourceCount >= 2) {
    return "Corroborated";
  }

  if (hasUrl) {
    return "Single source";
  }

  return "Unverified";
}


// ------------------------------------------------------------
// CONSISTENCY
// ------------------------------------------------------------

function getConsistencyIssues(deal) {

  var issues =
    validateDealStructure(deal).problems.slice();


  var taxonomyFields = [
    { key: "dealType", list: dealTypes, label: "deal type" },
    { key: "therapeuticArea", list: therapeuticAreas, label: "therapeutic area" },
    { key: "modality", list: modalities, label: "modality" },
    { key: "developmentStage", list: developmentStages, label: "development stage" },
    { key: "dealStatus", list: dealStatuses, label: "deal status" },
    { key: "dealScope", list: dealScopes, label: "deal scope" },
    { key: "dealValueType", list: dealValueTypes, label: "deal value type" }
  ];


  taxonomyFields.forEach(function(field) {

    var value =
      deal[field.key];

    if (
      hasValue(value) &&
      field.list.indexOf(value) < 0
    ) {
      issues.push(
        "Unmapped " +
        field.label +
        ": " +
        value
      );
    }
  });


  // A small bare number almost certainly means
  // millions, so flag the missing unit.
  [
    "dealValue",
    "upfrontValue",
    "milestoneValue"
  ].forEach(function(key) {

    var raw =
      Number(deal[key]);

    if (
      Number.isFinite(raw) &&
      raw > 0 &&
      raw < 1000
    ) {
      issues.push(
        "Value may be missing a unit (" +
        key +
        "=" +
        raw +
        ")"
      );
    }
  });


  return issues;
}


// ------------------------------------------------------------
// REVIEW STATE
// ------------------------------------------------------------

function getReviewState(deal, missing, issues, tier) {

  var hardErrors = [
    "Buyer and target appear identical",
    "Negative deal value",
    "Announcement date is in the future"
  ];


  var hard =
    issues.some(function(issue) {

      return hardErrors.indexOf(issue) >= 0;

    });


  if (hard) {
    return "Reject";
  }


  var critical = [
    "Deal Type",
    "Target",
    "Source URL"
  ];


  var missingCritical =
    missing.some(function(field) {

      return critical.indexOf(field) >= 0;

    });


  var confidence =
    Number(deal.confidence);

  var lowConfidence =
    Number.isFinite(confidence) &&
    confidence < 0.5;


  if (
    missingCritical ||
    issues.length ||
    lowConfidence ||
    tier === "Unverified"
  ) {
    return "Review";
  }


  return "OK";
}

// ======================================================
// FULL PIPELINE
// ======================================================

function runDealPipeline() {

  Logger.log(
    "Starting Life Sciences Deal Pipeline..."
  );


  // Prevent overlapping runs (e.g. a trigger firing while
  // a manual run is still going).
  var lock =
    LockService.getScriptLock();

  if (!lock.tryLock(1000)) {
    Logger.log(
      "Another pipeline run is in progress. Skipping this run."
    );
    return { skipped: true };
  }


  var startedAt = new Date();
  var feedMetrics = {};
  var flagMetrics = {};
  var processMetrics = {};
  var validationMetrics = {};


  try {

    // Each stage is isolated so one failure does not
    // prevent the later stages (especially validation).
    try {
      feedMetrics = fetchNewsFeeds() || {};
    } catch (feedError) {
      Logger.log("fetchNewsFeeds failed: " + feedError.message);
    }

    try {
      flagMetrics = flagPotentialDeals() || {};
    } catch (flagError) {
      Logger.log("flagPotentialDeals failed: " + flagError.message);
    }

    try {
      processMetrics = processPotentialDeals() || {};
    } catch (processError) {
      Logger.log("processPotentialDeals failed: " + processError.message);
    }

    try {
      validationMetrics = validateExistingDeals() || {};
    } catch (validationError) {
      Logger.log("validateExistingDeals failed: " + validationError.message);
    }

  } finally {

    lock.releaseLock();
  }


  var metrics = {

    startedAt: startedAt,

    finishedAt: new Date(),

    feeds: feedMetrics.feeds || 0,

    articlesAdded: feedMetrics.added || 0,

    articlesSeen: flagMetrics.seen || 0,

    alreadyProcessed:
      flagMetrics.alreadyProcessed || 0,

    flagged: flagMetrics.flagged || 0,

    processed: processMetrics.processed || 0,

    deferred: processMetrics.deferred || 0,

    dealsAdded: processMetrics.added || 0,

    dealsUpdated: processMetrics.updated || 0,

    reviewed: validationMetrics.reviewed || 0,

    review: validationMetrics.review || 0,

    reject: validationMetrics.reject || 0
  };


  logPipelineRun(metrics);


  // Freshness marker used by the dashboard.
  PropertiesService
    .getScriptProperties()
    .setProperty(
      "LAST_PIPELINE_RUN",
      startedAt.toISOString()
    );


  Logger.log(
    "Life Sciences Deal Pipeline complete. " +
    "Added " +
    metrics.dealsAdded +
    ", updated " +
    metrics.dealsUpdated +
    ", deferred " +
    metrics.deferred +
    ", review " +
    metrics.review +
    ", reject " +
    metrics.reject
  );


  return metrics;
}


// ======================================================
// PIPELINE RUN LOG (QA METRICS)
// ======================================================

function logPipelineRun(metrics) {

  var ss =
    SpreadsheetApp
      .getActiveSpreadsheet();

  var sheet =
    ss.getSheetByName("Pipeline Log");


  if (!sheet) {
    sheet =
      ss.insertSheet("Pipeline Log");
  }


  if (sheet.getLastRow() === 0) {

    sheet.appendRow([
      "Run At",
      "Feeds",
      "Articles Added",
      "Articles Seen",
      "Already Processed",
      "Flagged",
      "Processed",
      "Deferred",
      "Deals Added",
      "Deals Updated",
      "Reviewed",
      "Review",
      "Reject",
      "Duration (s)"
    ]);
  }


  var duration =
    (
      metrics.finishedAt.getTime() -
      metrics.startedAt.getTime()
    ) / 1000;


  sheet.appendRow([
    metrics.startedAt,
    metrics.feeds,
    metrics.articlesAdded,
    metrics.articlesSeen,
    metrics.alreadyProcessed,
    metrics.flagged,
    metrics.processed,
    metrics.deferred,
    metrics.dealsAdded,
    metrics.dealsUpdated,
    metrics.reviewed,
    metrics.review,
    metrics.reject,
    duration
  ]);
}

// ======================================================
// SHEET DATA VALIDATION (dropdowns)
// ======================================================

function setupDealDataValidation() {

  var ss =
    SpreadsheetApp.getActiveSpreadsheet();

  var sheet =
    ss.getSheetByName("Deals");

  if (!sheet) {
    throw new Error("Deals sheet not found.");
  }


  ensureDealsColumns(sheet);


  var lastRow =
    Math.max(
      sheet.getMaxRows(),
      1000
    );


  function requireList(
    column,
    values
  ) {

    var rule =
      SpreadsheetApp
        .newDataValidation()
        .requireValueInList(
          values,
          true
        )
        .setAllowInvalid(true)
        .build();


    sheet
      .getRange(
        2,
        column,
        lastRow - 1,
        1
      )
      .setDataValidation(rule);
  }


  requireList(7, dealTypes);
  requireList(8, dealStatuses);
  requireList(9, dealScopes);
  requireList(14, therapeuticAreas);
  requireList(17, modalities);
  requireList(18, developmentStages);
  requireList(33, dealValueTypes);
  requireList(34, ["OK", "Review", "Reject"]);
  requireList(35, ["Verified", "Corroborated", "Single source", "Unverified"]);


  Logger.log(
    "Deals data validation applied."
  );
}


// ======================================================
// ONE-TIME SETUP
// ======================================================

function setupProject() {

  setupDealsHeaders();

  setupDealDataValidation();

  Logger.log(
    "Project set up. Headers and data validation applied."
  );
}


// ======================================================
// RUN EVERYTHING (one-off)
// ======================================================
// Convenience entry point: sets up the sheet once, then
// runs the full pipeline. Use this to "run all code once".

function runEverything() {

  setupProject();

  return runDealPipeline();
}


// ======================================================
// DIAGNOSE PIPELINE STATE
// ======================================================
// Run this and paste the log output. It reports how many
// articles were seen/flagged/processed and whether any
// flagged deals look unwritten.

function diagnosePipeline() {

  var ss =
    SpreadsheetApp.getActiveSpreadsheet();

  var news =
    ss.getSheetByName("News Feed");

  var deals =
    ss.getSheetByName("Deals");


  var stats = {

    newsRows: 0,

    flagged: 0,

    processed: 0,

    pending: 0,

    dealYes: 0,

    dealNo: 0,

    dealRows: 0,

    hasApiKey: false,

    lastRun: "",

    sources: 0
  };


  if (news) {

    var lastRow =
      news.getLastRow();

    stats.newsRows =
      Math.max(0, lastRow - 1);


    if (lastRow >= 2) {

      var values =
        news
          .getRange(2, 1, lastRow - 1, 9)
          .getValues();


      values.forEach(function(row) {

        var keyword = row[6];
        var processed = row[7];
        var deal = row[8];

        var isFlag =
          keyword === "Potential Deal";

        var isProcessed =
          processed === true ||
          String(processed).toUpperCase() === "TRUE";

        var isDeal =
          deal === true ||
          String(deal).toUpperCase() === "TRUE";


        if (isFlag) {

          stats.flagged++;

          if (isProcessed) {
            stats.processed++;
          } else {
            stats.pending++;
          }

          if (isDeal) {
            stats.dealYes++;
          } else {
            stats.dealNo++;
          }
        }
      });
    }
  }


  if (deals) {
    stats.dealRows =
      Math.max(0, deals.getLastRow() - 1);
  }


  var sources =
    ss.getSheetByName("Sources");

  if (sources && sources.getLastRow() >= 2) {

    var srcRows =
      sources
        .getRange(2, 1, sources.getLastRow() - 1, 6)
        .getValues();

    stats.sources =
      srcRows.filter(function(row) {
        return (
          row[5] === true ||
          String(row[5]).toUpperCase() === "TRUE"
        );
      }).length;
  }


  stats.hasApiKey =
    !!PropertiesService
      .getScriptProperties()
      .getProperty("DEEPSEEK_API_KEY");

  stats.lastRun =
    PropertiesService
      .getScriptProperties()
      .getProperty("LAST_PIPELINE_RUN") || "";


  Logger.log(
    JSON.stringify(stats, null, 2)
  );

  return stats;
}


// ======================================================
// RECOVER DEALS LOST TO A MID-RUN TIMEOUT
// ======================================================
// Any article flagged as a deal but not written to the
// Deals sheet can be reprocessed. Dedup means already
// written deals are updated, not duplicated.

function reprocessDeals() {

  var sheet =
    SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName("News Feed");

  if (!sheet) {
    throw new Error("News Feed sheet not found.");
  }


  var lastRow =
    sheet.getLastRow();

  if (lastRow < 2) {
    Logger.log("No news articles.");
    return;
  }


  var range =
    sheet.getRange(
      2,
      8,
      lastRow - 1,
      2
    );

  var values =
    range.getValues();

  var reset = 0;


  for (
    var i = 0;
    i < values.length;
    i++
  ) {

    var deal = values[i][1];

    var isDeal =
      deal === true ||
      String(deal).toUpperCase() === "TRUE";


    if (isDeal) {
      values[i][0] = false;
      reset++;
    }
  }


  range.setValues(values);


  Logger.log(
    "Reset Processed for " +
    reset +
    " deal article(s). Now run processPotentialDeals."
  );
}


// ======================================================
// FIND DEAL ARTICLES NOT WRITTEN TO THE DEALS SHEET
// ======================================================
// Lists articles classified as deals whose URL appears
// nowhere in Deals (so we can be sure nothing was lost
// to the earlier timeout).

function findUnwrittenDeals() {

  var ss =
    SpreadsheetApp.getActiveSpreadsheet();

  var news =
    ss.getSheetByName("News Feed");

  var deals =
    ss.getSheetByName("Deals");

  if (!news || !deals) {
    throw new Error("News Feed or Deals sheet not found.");
  }


  var known = {};

  function addUrl(value) {
    var normalised = normaliseUrl(value);
    if (normalised) {
      known[normalised] = true;
    }
  }


  var dealsLast = deals.getLastRow();

  if (dealsLast >= 2) {

    var dealValues =
      deals
        .getRange(2, 1, dealsLast - 1, 44)
        .getValues();

    dealValues.forEach(function(row) {

      addUrl(row[24]); // Source URL
      addUrl(row[37]); // Primary Source URL

      String(row[36] || "")
        .split("\n")
        .forEach(function(line) {
          var parts = line.split(" | ");
          addUrl(parts[parts.length - 1]);
        });
    });
  }


  var missing = [];

  var newsLast = news.getLastRow();

  if (newsLast >= 2) {

    var newsValues =
      news
        .getRange(2, 1, newsLast - 1, 9)
        .getValues();

    newsValues.forEach(function(row, index) {

      var keyword = row[6];
      var deal = row[8];

      var isDeal =
        deal === true ||
        String(deal).toUpperCase() === "TRUE";

      if (keyword !== "Potential Deal" || !isDeal) {
        return;
      }

      var url = row[4];
      var normalised = normaliseUrl(url);

      if (normalised && !known[normalised]) {
        missing.push({
          row: index + 2,
          headline: row[3],
          url: url
        });
      }
    });
  }


  Logger.log(
    "Unwritten deal articles: " + missing.length
  );

  missing.slice(0, 100).forEach(function(item) {
    Logger.log(
      "row " + item.row +
      " | " + item.headline +
      " | " + item.url
    );
  });

  return missing;
}


// ======================================================
// REPROCESS ONLY THE UNWRITTEN DEALS
// ======================================================

function reprocessUnwrittenDeals() {

  var missing =
    findUnwrittenDeals();


  if (!missing.length) {
    Logger.log(
      "Nothing to reprocess - every deal article is accounted for."
    );
    return;
  }


  var sheet =
    SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName("News Feed");


  missing.forEach(function(item) {

    sheet
      .getRange(item.row, 8)
      .setValue(false);

  });


  Logger.log(
    "Reset Processed for " +
    missing.length +
    " unwritten deal(s). Now run processPotentialDeals."
  );
}


// ======================================================
// TIME-BASED TRIGGER
// ======================================================
// Run once to schedule the pipeline every `hours`
// hours (default 6). Run removePipelineTrigger() to
// cancel.

function installPipelineTrigger(hours) {

  removePipelineTrigger();


  var interval =
    Number(hours) || 6;


  ScriptApp
    .newTrigger("runDealPipeline")
    .timeBased()
    .everyHours(interval)
    .create();


  Logger.log(
    "Pipeline trigger installed: every " +
    interval +
    " hour(s)."
  );
}


// Useful while draining a backlog: runs every N minutes
// (allowed values: 1, 5, 10, 15 or 30).

function installFrequentTrigger(minutes) {

  removePipelineTrigger();


  var interval =
    Number(minutes) || 15;


  ScriptApp
    .newTrigger("runDealPipeline")
    .timeBased()
    .everyMinutes(interval)
    .create();


  Logger.log(
    "Pipeline trigger installed: every " +
    interval +
    " minute(s)."
  );
}


function removePipelineTrigger() {

  var triggers =
    ScriptApp.getProjectTriggers();


  triggers.forEach(function(trigger) {

    if (
      trigger.getHandlerFunction() ===
      "runDealPipeline"
    ) {
      ScriptApp.deleteTrigger(trigger);
    }

  });
}


// ======================================================
// SET UP DEALS SHEET HEADERS
// ======================================================
// Run this once so columns AH-AR are labelled.
// The Taxonomy sheet is for allowed values only, so
// validation/quality field names must live here.

function setupDealsHeaders() {

  var ss =
    SpreadsheetApp.getActiveSpreadsheet();

  var sheet =
    ss.getSheetByName("Deals");

  if (!sheet) {
    throw new Error("Deals sheet not found.");
  }


  ensureDealsColumns(sheet);


  var headers = [
    "Deal ID",
    "Announcement Date",
    "Buyer",
    "Buyer Type",
    "Target",
    "Target Type",
    "Deal Type",
    "Deal Status",
    "Deal Scope",
    "Deal Value",
    "Upfront Value",
    "Milestone Value",
    "Currency",
    "Therapeutic Area",
    "Disease Area",
    "Indication",
    "Modality",
    "Development Stage",
    "Lead Asset",
    "Strategic Rationale",
    "Strategic Rationale Tags",
    "Buyer Country",
    "Target Country",
    "Source",
    "Source URL",
    "Source Date",
    "Last Verified",
    "Confidence",
    "AI Summary",
    "Notes",
    "Year",
    "Month",
    "Deal Value Type",
    "Review State",
    "Validation Status",
    "Source Count",
    "Corroborating Sources",
    "Primary Source URL",
    "Missing Fields",
    "Consistency Issues",
    "Validation Notes",
    "Value Raw",
    "Source Evidence",
    "Locked"
  ];


  sheet
    .getRange(1, 1, 1, headers.length)
    .setValues([headers]);


  Logger.log(
    "Deals headers written: " +
    headers.length +
    " columns."
  );
}

function companyNamesMatch(a, b) {
  var x = normaliseCompanyName(a);
  var y = normaliseCompanyName(b);

  if (!x || !y) return false;

  // Exact match after normalisation
  if (x === y) return true;

  // Handles cases such as:
  // "Telix" vs "Telix Pharmaceuticals"
  if (x.length >= 5 && y.indexOf(x) === 0) {
    return true;
  }

  if (y.length >= 5 && x.indexOf(y) === 0) {
    return true;
  }

  return false;
}

function validateDealStructure(deal) {

  var problems = [];

  // Buyer and target should not be the same company
  if (
    deal.buyer &&
    deal.target &&
    companyNamesMatch(
      deal.buyer,
      deal.target
    )
  ) {
    problems.push(
      "Buyer and target appear identical"
    );
  }


  // Deal values cannot be negative
  if (
    typeof deal.dealValue === "number" &&
    deal.dealValue < 0
  ) {
    problems.push(
      "Negative deal value"
    );
  }


  // Announcement date should not be
  // materially in the future
  if (deal.announcementDate) {

    var date =
      new Date(deal.announcementDate);

    var tomorrow =
      new Date();

    tomorrow.setDate(
      tomorrow.getDate() + 1
    );

    if (
      !isNaN(date.getTime()) &&
      date > tomorrow
    ) {
      problems.push(
        "Announcement date is in the future"
      );
    }
  }


  // A currency without financial information
  // is suspicious
  if (
    deal.currency &&
    !deal.dealValue &&
    !deal.upfrontValue &&
    !deal.milestoneValue
  ) {
    problems.push(
      "Currency supplied without financial value"
    );
  }


  return {
    valid: problems.length === 0,
    problems: problems
  };
}

// ======================================================
// NORMALISE URL
// ======================================================

function normaliseUrl(url) {

  if (!url) {
    return "";
  }

  return String(url)
    .trim()
    .toLowerCase()
    .split("?")[0]
    .replace(/\/$/, "");
}


// ======================================================
// NORMALISE HEADLINE
// ======================================================

function normaliseHeadline(headline) {

  if (!headline) {
    return "";
  }

  return String(headline)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}


// ======================================================
// SAFE DATE
// ======================================================

function safeDate(value) {

  if (!value) {
    return null;
  }

  var date =
    value instanceof Date
      ? value
      : new Date(value);

  if (
    isNaN(
      date.getTime()
    )
  ) {
    return null;
  }

  return date;
}


// ======================================================
// RSS DATE EXTRACTION
// ======================================================

function extractRssDate(item) {

  var possibleNames = [
    "pubDate",
    "date",
    "published",
    "updated"
  ];


  for (
    var i = 0;
    i < possibleNames.length;
    i++
  ) {

    var element =
      item.getChild(
        possibleNames[i]
      );

    if (element) {

      var raw =
        element.getValue() ||
        element.getText();

      var parsed =
        safeDate(raw);

      if (parsed) {
        return parsed;
      }
    }
  }


  // Some feeds use namespaces such as dc:date.
  var children =
    item.getChildren();


  for (
    var j = 0;
    j < children.length;
    j++
  ) {

    var child =
      children[j];

    var name =
      String(
        child.getName() || ""
      )
        .toLowerCase();


    if (
      name === "date" ||
      name === "published" ||
      name === "updated"
    ) {

      var childRaw =
        child.getValue() ||
        child.getText();

      var childDate =
        safeDate(
          childRaw
        );

      if (childDate) {
        return childDate;
      }
    }
  }


  return null;
}


// ======================================================
// CLEAN EXTRACTED COMPANY NAME
// ======================================================

function cleanExtractedCompanyName(name) {

  if (!name) {
    return "";
  }


  var cleaned =
    String(name)
      .trim()
      .replace(/\s+/g, " ");


  var lower =
    cleaned.toLowerCase();


  // Prevent generic descriptions from becoming
  // permanent "company names".
  var genericPatterns = [
    /^a biotech$/,
    /^biotech$/,
    /^a pharmaceutical company$/,
    /^pharmaceutical company$/,
    /^a pharma company$/,
    /^pharma company$/,
    /^a chinese biotech$/,
    /^chinese biotech$/,
    /^a specialist chinese biotech$/,
    /^specialist chinese biotech$/,
    /^an asia-based cell therapy partner$/,
    /^asia-based cell therapy partner$/,
    /^unnamed biotech$/,
    /^unnamed company$/,
    /^undisclosed company$/,
    /^undisclosed biotech$/,
    /^investors$/,
    /^multiple investors$/,
    /^venture investors$/
  ];


  for (
    var i = 0;
    i < genericPatterns.length;
    i++
  ) {

    if (
      genericPatterns[i]
        .test(lower)
    ) {
      return "";
    }
  }


  return cleaned;
}


// ======================================================
// COMPANY NORMALISATION
// ======================================================

function normaliseCompanyName(name) {

  if (!name) {
    return "";
  }


  var cleaned =
    String(name)
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(
        /\b(incorporated|inc|limited|ltd|plc|corporation|corp|company|co|llc|se|ag|nv|sa)\b/g,
        " "
      )
      .replace(
        /[^a-z0-9]+/g,
        " "
      )
      .replace(
        /\s+/g,
        " "
      )
      .trim();


  // ----------------------------------------------
  // Known aliases
  // ----------------------------------------------
  // We only add aliases where we are confident
  // that different news sources commonly use
  // different versions of the same company name.

  var aliasMap = {

    "telix":
      "telix",

    "telix pharmaceuticals":
      "telix",

    "itm":
      "itm",

    "itm isotope technologies munich":
      "itm",

    "itm isotope technologies munich se":
      "itm",

    "boehringer":
      "boehringer ingelheim",

    "boehringer ingelheim":
      "boehringer ingelheim",

    "gsk":
      "gsk",

    "glaxosmithkline":
      "gsk",

    "glaxo smith kline":
      "gsk",

    "novo nordisk":
      "novo nordisk",

    "novartis":
      "novartis",

    "roche":
      "roche",

    "f hoffmann la roche":
      "roche",

    "bayer":
      "bayer",

    "grunenthal":
      "grunenthal",

    "grünenthal":
      "grunenthal"
  };


  if (
    aliasMap[cleaned]
  ) {
    return aliasMap[cleaned];
  }


  return cleaned;
}


// ======================================================
// DEAL TYPE FAMILY
// ======================================================

function getDealTypeFamily(
  dealType
) {

  var type =
    String(
      dealType || ""
    )
      .trim()
      .toLowerCase();


  if (
    type === "acquisition" ||
    type === "merger" ||
    type === "asset acquisition"
  ) {
    return "m&a";
  }


  if (
    type === "licensing" ||
    type === "in-licensing" ||
    type === "out-licensing"
  ) {
    return "licensing";
  }


  if (
    type === "co-development" ||
    type === "co-commercialisation" ||
    type === "partnership" ||
    type === "joint venture"
  ) {
    return "collaboration";
  }


  if (
    type === "strategic investment" ||
    type === "venture investment"
  ) {
    return "investment";
  }


  if (
    type === "divestiture"
  ) {
    return "divestiture";
  }


  return type || "other";
}


// ======================================================
// BUILD MULTIPLE DEAL KEYS
// ======================================================

function makeDealKeys(
  buyer,
  target,
  dealType
) {

  var a =
    normaliseCompanyName(
      buyer
    );

  var b =
    normaliseCompanyName(
      target
    );


  if (
    !a ||
    !b
  ) {
    return [];
  }


  var parties =
    [a, b].sort();


  var family =
    getDealTypeFamily(
      dealType
    );


  // Pair key catches situations such as:
  // Merger vs Acquisition
  // Partnership vs Co-Development
  //
  // Family key gives us a more specific comparison
  // when needed.

  return [
    "PAIR|" +
      parties[0] +
      "|" +
      parties[1],

    "FAMILY|" +
      parties[0] +
      "|" +
      parties[1] +
      "|" +
      family
  ];
}


// ======================================================
// ADD DEAL TO CROSS-SOURCE INDEX
// ======================================================

function addDealToIndex(
  index,
  buyer,
  target,
  dealType,
  dealDate,
  row
) {

  var keys =
    makeDealKeys(
      buyer,
      target,
      dealType
    );


  for (
    var i = 0;
    i < keys.length;
    i++
  ) {

    if (!index[keys[i]]) {
      index[keys[i]] = [];
    }


    var alreadyExists =
      false;


    for (
      var j = 0;
      j < index[keys[i]].length;
      j++
    ) {

      if (
        index[keys[i]][j].row ===
        row
      ) {

        alreadyExists =
          true;

        break;
      }
    }


    if (!alreadyExists) {

      index[keys[i]].push({
        row: row,
        date: dealDate,
        buyer: buyer,
        target: target,
        dealType: dealType
      });
    }
  }
}


// ======================================================
// FIND CROSS-SOURCE DUPLICATE
// ======================================================

function findMatchingDealRow(
  buyer,
  target,
  dealType,
  dealDate,
  existingDealIndex
) {

  var keys =
    makeDealKeys(
      buyer,
      target,
      dealType
    );


  if (
    keys.length === 0
  ) {
    return null;
  }


  // Search family-specific key first.
  var searchKeys = [
    keys[1],
    keys[0]
  ];


  for (
    var k = 0;
    k < searchKeys.length;
    k++
  ) {

    var candidates =
      existingDealIndex[
        searchKeys[k]
      ] || [];


    for (
      var c = 0;
      c < candidates.length;
      c++
    ) {

      var candidate =
        candidates[c];


      if (
        datesCloseEnough(
          dealDate,
          candidate.date,
          120
        )
      ) {

        return candidate.row;
      }
    }
  }


  return null;
}


// ======================================================
// DATE PROXIMITY
// ======================================================

function datesCloseEnough(
  dateA,
  dateB,
  maxDays
) {

  var a =
    safeDate(dateA);

  var b =
    safeDate(dateB);


  if (
    !a ||
    !b
  ) {

    // If dates are missing, company matching is
    // still useful, but we don't want to merge
    // uncertain records automatically.
    return false;
  }


  var milliseconds =
    Math.abs(
      a.getTime() -
      b.getTime()
    );


  var days =
    milliseconds /
    (
      1000 *
      60 *
      60 *
      24
    );


  return days <= maxDays;
}


// ======================================================
// STANDARDISE MONEY
// ======================================================

function parseMoneyDetails(
  value
) {

  var result = {
    value: "",
    unitExplicit: false,
    raw: ""
  };


  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return result;
  }


  if (
    typeof value === "number"
  ) {

    // Existing extraction occasionally returned
    // values such as 53 when the article meant
    // $53M. We cannot safely infer the multiplier
    // from a naked number, so preserve it and let
    // validation flag the missing unit.
    result.value = value;
    result.raw = String(value);

    return result;
  }


  var original =
    String(value)
      .trim();


  if (!original) {
    return result;
  }


  result.raw = original;


  var lower =
    original
      .toLowerCase()
      .replace(/,/g, "");


  if (
    lower === "undisclosed" ||
    lower === "not disclosed" ||
    lower === "n/a" ||
    lower === "na" ||
    lower === "unknown"
  ) {
    return result;
  }


  var match =
    lower.match(
      /(-?\d+(?:\.\d+)?)\s*(trillion|billion|million|thousand|tn|bn|b|mm|m|k)?/
    );


  if (!match) {
    return result;
  }


  var number =
    parseFloat(
      match[1]
    );


  if (
    isNaN(number)
  ) {
    return result;
  }


  var unit =
    match[2] || "";


  result.unitExplicit =
    !!unit ||
    /[$€£¥]|usd|eur|gbp|jpy|cny/
      .test(
        lower
      );


  if (
    unit === "trillion" ||
    unit === "tn"
  ) {

    number *=
      1000000000000;
    number = Math.round(number);

  } else if (
    unit === "billion" ||
    unit === "bn" ||
    unit === "b"
  ) {

    number *=
      1000000000;
    number = Math.round(number);

  } else if (
    unit === "million" ||
    unit === "mm" ||
    unit === "m"
  ) {

    number *=
      1000000;
    number = Math.round(number);

  } else if (
    unit === "thousand" ||
    unit === "k"
  ) {

    number *=
      1000;
    number = Math.round(number);
  }


  result.value = number;

  return result;
}


function standardiseMoneyValue(
  value
) {

  return parseMoneyDetails(
    value
  ).value;
}


// ======================================================
// SET A CELL ONLY WHEN CURRENTLY EMPTY
// ======================================================

function setIfEmpty(
  sheet,
  row,
  column,
  value
) {

  if (!value) {
    return;
  }


  var cell =
    sheet.getRange(row, column);

  var current =
    String(
      cell.getValue() || ""
    ).trim();


  if (!current) {
    cell.setValue(value);
  }
}


// ======================================================
// RUNTIME BUDGET
// ======================================================
// Apps Script stops a run at ~6 minutes. Long stages use
// this budget to stop cleanly and resume next run.
// Override with the Script Property MAX_RUNTIME_MS.

function getRuntimeBudgetMs() {

  var configured =
    PropertiesService
      .getScriptProperties()
      .getProperty("MAX_RUNTIME_MS");


  var budget =
    Number(configured);


  if (
    !Number.isFinite(budget) ||
    budget <= 0
  ) {
    budget = 4.5 * 60 * 1000;
  }


  return budget;
}


// ======================================================
// CHOOSE BETTER TEXT VALUE
// ======================================================

function chooseBetterValue(
  newValue,
  oldValue
) {

  var newText =
    newValue === null ||
    newValue === undefined
      ? ""
      : String(newValue).trim();


  var oldText =
    oldValue === null ||
    oldValue === undefined
      ? ""
      : String(oldValue).trim();


  if (!newText) {
    return oldValue || "";
  }


  if (!oldText) {
    return newValue;
  }


  // Prefer the more descriptive company/asset/text
  // value when both are present.
  if (
    newText.length >
    oldText.length
  ) {
    return newValue;
  }


  return oldValue;
}


// ======================================================
// CHOOSE MONEY VALUE
// ======================================================

function chooseMoneyValue(
  newValue,
  oldValue
) {

  var newNumber =
    Number(newValue);

  var oldNumber =
    Number(oldValue);


  var newValid =
    newValue !== "" &&
    !isNaN(newNumber);


  var oldValid =
    oldValue !== "" &&
    !isNaN(oldNumber);


  if (
    newValid &&
    !oldValid
  ) {
    return newNumber;
  }


  if (
    !newValid &&
    oldValid
  ) {
    return oldNumber;
  }


  if (
    newValid &&
    oldValid
  ) {

    // If both sources give values, preserve the
    // larger stated potential value.
    return Math.max(
      newNumber,
      oldNumber
    );
  }


  return "";
}


// ======================================================
// CHOOSE PREFERRED DEAL TYPE
// ======================================================

function choosePreferredDealType(
  newType,
  oldType
) {

  if (!oldType) {
    return newType || "";
  }


  if (!newType) {
    return oldType;
  }


  var newFamily =
    getDealTypeFamily(
      newType
    );

  var oldFamily =
    getDealTypeFamily(
      oldType
    );


  // If they belong to completely different families,
  // retain the existing classification rather than
  // silently rewriting the transaction.
  if (
    newFamily !==
    oldFamily
  ) {
    return oldType;
  }


  var preference = {
    "Acquisition": 5,
    "Merger": 5,
    "Asset Acquisition": 5,

    "Licensing": 5,
    "In-Licensing": 5,
    "Out-Licensing": 5,

    "Co-Development": 5,
    "Co-Commercialisation": 5,
    "Joint Venture": 4,
    "Partnership": 3,

    "Venture Investment": 5,
    "Strategic Investment": 4,

    "Divestiture": 5,
    "Other": 1
  };


  var newScore =
    preference[newType] || 0;

  var oldScore =
    preference[oldType] || 0;


  if (
    newScore >
    oldScore
  ) {
    return newType;
  }


  return oldType;
}


// ======================================================
// MERGE STRATEGIC RATIONALE TAGS
// ======================================================

function mergeTags(
  oldTags,
  newTags
) {

  var combined =
    String(oldTags || "") +
    "," +
    String(newTags || "");


  var pieces =
    combined.split(
      /[,;]+/
    );


  var seen = {};
  var result = [];


  for (
    var i = 0;
    i < pieces.length;
    i++
  ) {

    var tag =
      pieces[i].trim();


    if (!tag) {
      continue;
    }


    var key =
      tag.toLowerCase();


    if (!seen[key]) {

      seen[key] =
        true;

      result.push(
        tag
      );
    }
  }


  return result.join(
    ", "
  );
}

function addCorroboratingSource(
  dealsSheet,
  row,
  source,
  url,
  primaryUrl
) {

  var sourceCountCell =
    dealsSheet.getRange(row, 36);

  var sourcesCell =
    dealsSheet.getRange(row, 37);


  // Before the deal row is rewritten, make sure the
  // original article is recorded as the primary source.
  ensurePrimarySourceUrl(
    dealsSheet,
    row,
    primaryUrl
  );


  var currentCount =
    Number(
      sourceCountCell.getValue()
    ) || 1;

  var currentSources =
    String(
      sourcesCell.getValue() || ""
    );


  var entry =
    String(source || "").trim() +
    (url ? " | " + url : "");


  // Avoid adding same source twice
  if (
    entry &&
    currentSources.indexOf(entry) === -1
  ) {

    if (currentSources) {
      currentSources += "\n";
    }

    currentSources += entry;

    sourcesCell.setValue(
      currentSources
    );

    sourceCountCell.setValue(
      currentCount + 1
    );
  }
}

// ======================================================
// CONFIDENCE NORMALISATION
// ======================================================

function normaliseConfidence(
  value
) {

  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return 0;
  }


  var number =
    Number(value);


  if (
    isNaN(number)
  ) {

    var text =
      String(value)
        .trim()
        .toLowerCase();


    if (text === "high") {
      return 0.9;
    }


    if (text === "medium") {
      return 0.7;
    }


    if (text === "low") {
      return 0.5;
    }


    return 0;
  }


  // Some existing rows use 95 while others use 0.95.
  if (
    number > 1 &&
    number <= 100
  ) {

    number =
      number / 100;
  }


  if (number > 1) {
    number = 1;
  }


  if (number < 0) {
    number = 0;
  }


  return number;
}


// ======================================================
// CHOOSE HIGHER CONFIDENCE
// ======================================================

function chooseHigherConfidence(
  newValue,
  oldValue
) {

  var newConfidence =
    normaliseConfidence(
      newValue
    );

  var oldConfidence =
    normaliseConfidence(
      oldValue
    );


  return Math.max(
    newConfidence,
    oldConfidence
  );
}


// ======================================================
// CHOOSE EARLIER DATE
// ======================================================

function chooseEarlierDate(
  newValue,
  oldValue
) {

  var newDate =
    safeDate(newValue);

  var oldDate =
    safeDate(oldValue);


  if (!newDate) {
    return oldValue || newValue || "";
  }


  if (!oldDate) {
    return newValue || oldValue || "";
  }


  return newDate.getTime() <=
    oldDate.getTime()
      ? newDate
      : oldDate;
}


// ======================================================
// ENSURE PRIMARY SOURCE URL
// ======================================================

function ensurePrimarySourceUrl(
  dealsSheet,
  row,
  fallbackUrl
) {

  var cell =
    dealsSheet.getRange(row, 38);

  var current =
    String(
      cell.getValue() || ""
    ).trim();


  if (current) {
    return;
  }


  var candidate =
    String(
      fallbackUrl || ""
    ).trim() ||
    String(
      dealsSheet
        .getRange(row, 25)
        .getValue() || ""
    ).trim();


  if (candidate) {
    cell.setValue(candidate);
  }
}

function auditExistingDuplicates() {

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Deals");

  if (!sheet) {
    throw new Error("Deals sheet not found.");
  }

  var lastRow = sheet.getLastRow();

  if (lastRow < 3) {
    Logger.log("Not enough deals to audit.");
    return;
  }

  var data = sheet
    .getRange(2, 1, lastRow - 1, 33)
    .getValues();

  var matches = 0;

  Logger.log("========================================");
  Logger.log("STARTING EXISTING DEAL DUPLICATE AUDIT");
  Logger.log("========================================");

  for (var i = 0; i < data.length; i++) {

    var rowA = i + 2;

    var idA = data[i][0];
    var dateA = data[i][1];
    var buyerA = data[i][2];
    var targetA = data[i][4];
    var typeA = data[i][6];
    var valueA = data[i][9];

    if (!buyerA || !targetA) {
      continue;
    }

    var keysA = makeDealKeys(
      buyerA,
      targetA,
      typeA
    );

    if (keysA.length === 0) {
      continue;
    }

    for (var j = i + 1; j < data.length; j++) {

      var rowB = j + 2;

      var idB = data[j][0];
      var dateB = data[j][1];
      var buyerB = data[j][2];
      var targetB = data[j][4];
      var typeB = data[j][6];
      var valueB = data[j][9];

      if (!buyerB || !targetB) {
        continue;
      }

      var keysB = makeDealKeys(
        buyerB,
        targetB,
        typeB
      );

      if (keysB.length === 0) {
        continue;
      }

      // Compare the party-pair key.
      // This ignores direction so that:
      // Bayer / Grünenthal
      // and
      // Grünenthal / Bayer
      // can still be recognised as the same parties.

      var sameParties =
        keysA[0] === keysB[0];

      if (!sameParties) {
        continue;
      }

      // Only flag transactions reasonably close in time.
      var closeDates =
        datesCloseEnough(
          dateA,
          dateB,
          120
        );

      if (!closeDates) {
        continue;
      }

      matches++;

      Logger.log("");
      Logger.log(
        "---------- POSSIBLE DUPLICATE #" +
        matches +
        " ----------"
      );

      Logger.log(
        "ROW " +
        rowA +
        " | " +
        idA
      );

      Logger.log(
        buyerA +
        " / " +
        targetA +
        " | " +
        typeA +
        " | Value: " +
        valueA +
        " | Date: " +
        dateA
      );

      Logger.log("");

      Logger.log(
        "ROW " +
        rowB +
        " | " +
        idB
      );

      Logger.log(
        buyerB +
        " / " +
        targetB +
        " | " +
        typeB +
        " | Value: " +
        valueB +
        " | Date: " +
        dateB
      );

      Logger.log(
        "--------------------------------------"
      );
    }
  }

  Logger.log("");
  Logger.log("========================================");
  Logger.log(
    "AUDIT COMPLETE. POSSIBLE DUPLICATE PAIRS: " +
    matches
  );
  Logger.log("========================================");
}

function validateExistingDeals() {

  var ss =
    SpreadsheetApp.getActiveSpreadsheet();

  var sheet =
    ss.getSheetByName("Deals");

  if (!sheet) {
    throw new Error(
      "Deals sheet not found."
    );
  }


  ensureDealsColumns(sheet);


  var lastRow =
    sheet.getLastRow();

  if (lastRow < 2) {
    Logger.log(
      "No deals to validate."
    );
    return {
      reviewed: 0,
      review: 0,
      reject: 0
    };
  }


  // Read the full 44-column structure.
  var data =
    sheet
      .getRange(
        2,
        1,
        lastRow - 1,
        44
      )
      .getValues();


  var reviewCount = 0;
  var rejectCount = 0;
  var reviewed = 0;
  var results = [];

  // Deals that are not in a terminal state and older
  // than this are flagged for a status refresh.
  var staleDays = 90;


  for (
    var i = 0;
    i < data.length;
    i++
  ) {

    var rowNumber = i + 2;
    var row = data[i];


    // Skip genuinely blank rows (some sheets carry
    // leftover formulas far below the data).
    if (
      !hasValue(row[0]) &&
      !hasValue(row[2]) &&
      !hasValue(row[4])
    ) {

      results.push([
        row[33],
        row[34],
        row[35],
        row[36],
        row[37],
        row[38],
        row[39],
        row[40]
      ]);

      continue;
    }


    reviewed++;


    var deal = {

      dealId: row[0],

      announcementDate: row[1],

      buyer: row[2],

      buyerType: row[3],

      target: row[4],

      targetType: row[5],

      dealType: row[6],

      dealStatus: row[7],

      dealScope: row[8],

      dealValue: row[9],

      upfrontValue: row[10],

      milestoneValue: row[11],

      currency: row[12],

      therapeuticArea: row[13],

      diseaseArea: row[14],

      indication: row[15],

      modality: row[16],

      developmentStage: row[17],

      leadAsset: row[18],

      strategicRationale: row[19],

      source: row[23],

      sourceUrl: row[24],

      sourceDate: row[25],

      confidence: row[27],

      dealValueType: row[32],

      sourceCount:
        Number(row[35]) || 1,

      corroboratingSources:
        row[36] || "",

      primarySourceUrl:
        row[37] || ""
    };


    // Older rows may predate the Primary Source URL
    // column. Fall back to the deal's own source URL.
    if (
      !deal.primarySourceUrl &&
      deal.sourceUrl
    ) {
      deal.primarySourceUrl =
        deal.sourceUrl;
    }


    // --------------------------------
    // Dimensions
    // --------------------------------

    var missing =
      getMissingFields(deal);

    var issues =
      getConsistencyIssues(deal);


    // --------------------------------
    // Stale-status check
    // --------------------------------

    var statusText =
      String(
        deal.dealStatus || ""
      ).trim();

    var terminal = [
      "Completed",
      "Terminated",
      "Withdrawn"
    ].indexOf(statusText) >= 0;

    if (
      !terminal &&
      deal.announcementDate
    ) {

      var announced =
        safeDate(
          deal.announcementDate
        );

      if (announced) {

        var ageDays =
          (
            new Date().getTime() -
            announced.getTime()
          ) /
          (
            1000 * 60 * 60 * 24
          );

        if (ageDays > staleDays) {
          issues.push(
            "Status not refreshed in >" +
            staleDays +
            " days"
          );
        }
      }
    }


    // --------------------------------
    // Tier + review state
    // --------------------------------

    var tier =
      getValidationTier(deal);

    var reviewState =
      getReviewState(
        deal,
        missing,
        issues,
        tier
      );


    if (reviewState === "Review") {
      reviewCount++;
    }

    if (reviewState === "Reject") {
      rejectCount++;
    }


    // --------------------------------
    // COLLECT RESULTS (AH-AO)
    // --------------------------------

    results.push([
      reviewState,
      tier,
      hasValue(row[35]) ? row[35] : 1,
      row[36] || "",
      hasValue(row[37])
        ? row[37]
        : (deal.primarySourceUrl || ""),
      missing.join(", "),
      issues.join(", "),
      buildValidationSummary(
        missing,
        issues,
        tier,
        reviewState
      )
    ]);


    Logger.log(
      deal.dealId +
      " | " +
      tier +
      " | " +
      reviewState +
      (
        issues.length
          ? " | " +
            issues.length +
            " issue(s)"
          : ""
      )
    );
  }


  // Single bulk write for the whole block (fast).
  sheet
    .getRange(2, 34, results.length, 8)
    .setValues(results);


  Logger.log(
    "VALIDATION COMPLETE. Review: " +
    reviewCount +
    ", Reject: " +
    rejectCount
  );


  return {
    reviewed: reviewed,
    review: reviewCount,
    reject: rejectCount
  };
}


function buildValidationSummary(
  missing,
  issues,
  tier,
  reviewState
) {

  var parts = [];

  parts.push(
    "Provenance: " + tier
  );

  parts.push(
    "Review: " + reviewState
  );


  if (missing.length) {
    parts.push(
      "Missing: " + missing.join(", ")
    );
  }


  if (issues.length) {
    parts.push(
      "Issues: " + issues.join(", ")
    );
  }


  return parts.join(" | ");
}