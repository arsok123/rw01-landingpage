const ID_SHEET = '1OpOtZYm3FROXfrtp2VqVYnCEavAniniGnhENndGpXhc';
const NAMA_SHEET = 'FormAspirasi';  // GANTI sesuai nama tab di sheet kamu

function doPost(e) {
  try {
    const ss = SpreadsheetApp.openById(ID_SHEET);
    const sheet = ss.getSheetByName(NAMA_SHEET);
    
    const data = JSON.parse(e.postData.contents);
    sheet.appendRow([new Date(), data.nama, data.pesan]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: error }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
