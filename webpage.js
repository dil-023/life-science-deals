function doGet() {
  return HtmlService
    .createTemplateFromFile("index")
    .evaluate()
    .setTitle("Life Sciences Deal Intelligence")
    .setXFrameOptionsMode(
      HtmlService.XFrameOptionsMode.ALLOWALL
    );
}


function getDashboardData() {

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Deals");

  if (!sheet) {
    throw new Error("Deals sheet not found.");
  }

  var lastRow = sheet.getLastRow();

  if (lastRow < 2) {
    return {
      deals: [],
      lastRun: getLastPipelineRun(),
      generatedAt:
        Utilities.formatDate(
          new Date(),
          Session.getScriptTimeZone(),
          "yyyy-MM-dd HH:mm"
        )
    };
  }

  var numColumns = Math.min(
    sheet.getMaxColumns(),
    44
  );

  var values = sheet
    .getRange(2, 1, lastRow - 1, numColumns)
    .getValues();

  var timezone = Session.getScriptTimeZone();

  var deals = values.map(function(row) {

    return {
      dealId: cleanWebValue(row[0]),

      announcementDate:
        formatWebDate(row[1], timezone),

      buyer: cleanWebValue(row[2]),
      buyerType: cleanWebValue(row[3]),

      target: cleanWebValue(row[4]),
      targetType: cleanWebValue(row[5]),

      dealType: cleanWebValue(row[6]),
      dealStatus: cleanWebValue(row[7]),
      dealScope: cleanWebValue(row[8]),

      dealValue: webNumber(row[9]),
      upfrontValue: webNumber(row[10]),
      milestoneValue: webNumber(row[11]),

      currency: cleanWebValue(row[12]),

      therapeuticArea:
        cleanWebValue(row[13]),

      diseaseArea:
        cleanWebValue(row[14]),

      indication:
        cleanWebValue(row[15]),

      modality:
        cleanWebValue(row[16]),

      developmentStage:
        cleanWebValue(row[17]),

      leadAsset:
        cleanWebValue(row[18]),

      strategicRationale:
        cleanWebValue(row[19]),

      strategicRationaleTags:
        cleanWebValue(row[20]),

      buyerCountry:
        cleanWebValue(row[21]),

      targetCountry:
        cleanWebValue(row[22]),

      source:
        cleanWebValue(row[23]),

      sourceUrl:
        cleanWebValue(row[24]),

      sourceDate:
        formatWebDate(row[25], timezone),

      lastVerified:
        formatWebDateTime(row[26], timezone),

      confidence:
        webNumber(row[27]),

      aiSummary:
        cleanWebValue(row[28]),

      notes:
        cleanWebValue(row[29]),

      year:
        cleanWebValue(row[30]),

      month:
        cleanWebValue(row[31]),

      dealValueType:
        cleanWebValue(row[32]),

      reviewState:
        cleanWebValue(row[33]),

      validationStatus:
        cleanWebValue(row[34]),

      sourceCount:
        webNumber(row[35]),

      corroboratingSources:
        cleanWebValue(row[36]),

      primarySourceUrl:
        cleanWebValue(row[37]),

      missingFields:
        cleanWebValue(row[38]),

      consistencyIssues:
        cleanWebValue(row[39]),

      validationNotes:
        cleanWebValue(row[40]),

      valueRaw:
        cleanWebValue(row[41]),

      sourceEvidence:
        cleanWebValue(row[42]),

      locked:
        cleanWebValue(row[43])
    };
  });

  return {
    deals: deals,
    lastRun: getLastPipelineRun(),
    generatedAt:
      Utilities.formatDate(
        new Date(),
        Session.getScriptTimeZone(),
        "yyyy-MM-dd HH:mm"
      )
  };
}


function getLastPipelineRun() {

  var value = PropertiesService
    .getScriptProperties()
    .getProperty("LAST_PIPELINE_RUN");

  if (!value) {
    return "";
  }

  var date = new Date(value);

  if (isNaN(date.getTime())) {
    return value;
  }

  return Utilities.formatDate(
    date,
    Session.getScriptTimeZone(),
    "yyyy-MM-dd HH:mm"
  );
}


function cleanWebValue(value) {

  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  return String(value).trim();
}


function webNumber(value) {

  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  if (typeof value === "number") {
    return value;
  }

  // Reuse the money normaliser from ma.gs
  // for older records that may still contain
  // values such as "$1.65 billion".
  if (
    typeof standardiseMoneyValue === "function"
  ) {

    var normalised =
      standardiseMoneyValue(value);

    if (
      normalised !== "" &&
      !isNaN(Number(normalised))
    ) {
      return Number(normalised);
    }
  }

  var numeric =
    Number(value);

  return isNaN(numeric)
    ? null
    : numeric;
}


function formatWebDate(value, timezone) {

  if (!value) {
    return "";
  }

  var date =
    value instanceof Date
      ? value
      : new Date(value);

  if (isNaN(date.getTime())) {
    return "";
  }

  return Utilities.formatDate(
    date,
    timezone,
    "yyyy-MM-dd"
  );
}


function formatWebDateTime(value, timezone) {

  if (!value) {
    return "";
  }

  var date =
    value instanceof Date
      ? value
      : new Date(value);

  if (isNaN(date.getTime())) {
    return "";
  }

  return Utilities.formatDate(
    date,
    timezone,
    "yyyy-MM-dd HH:mm"
  );
}