// Set the folder ID from the Google Drive link
const folderId = "18tLoylrAmFE9YVMnkTHhwdtmFugP73JPqXHkya6fLEWYzcbsuCQvDea0WxTv0ZkJa6EiYB0j";

// Load the Google API client library
function loadClient() {
  gapi.load("client", initClient);
}

// Initialize the API client with your API key and desired scopes
function initClient() {
  gapi.client.init({
    apiKey: "AIzaSyCiQuf6Ov8eLp4vH3Fm7-tmQR5pZIixuOg",
    discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
    scope: "https://www.googleapis.com/auth/drive.readonly"
  }).then(() => {
    // Call the Drive API to retrieve the folder contents
    gapi.client.drive.files.list({
      q: `'${folderId}' in parents and trashed=false`,
      fields: "files(name,mimeType)"
    }).then(response => {
      const files = response.result.files;
      displayFolderStructure(files);
    }).catch(error => {
      console.error("Error retrieving folder contents:", error);
    });
  }).catch(error => {
    console.error("Error initializing API client:", error);
  });
}

// Function to display the folder structure in the console
function displayFolderStructure(files, level = 0) {
  files.forEach(file => {
    console.log("  ".repeat(level) + file.name);
    
    if (file.mimeType === "application/vnd.google-apps.folder") {
      // Call the Drive API recursively for subfolders
      gapi.client.drive.files.list({
        q: `'${file.id}' in parents and trashed=false`,
        fields: "files(name,mimeType)"
      }).then(response => {
        const subfolderFiles = response.result.files;
        displayFolderStructure(subfolderFiles, level + 1);
      }).catch(error => {
        console.error("Error retrieving subfolder contents:", error);
      });
    }
  });
}
