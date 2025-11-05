const ID_SHEET = '1OpOtZYm3FROXfrtp2VqVYnCEavAniniGnhENndGpXhc';
const NAMA_SHEET = 'FormAspirasi';  // Pastikan tab ini ADA di Google Sheet kamu

function doPost(e) {
  try {
    const ss = SpreadsheetApp.openById(ID_SHEET);
    const sheet = ss.getSheetByName(NAMA_SHEET);
    if (!sheet) throw new Error("Sheet tidak ditemukan, pastikan nama tab sesuai!");

    const data = JSON.parse(e.postData.contents);
    sheet.appendRow([new Date(), data.nama, data.pesan]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
