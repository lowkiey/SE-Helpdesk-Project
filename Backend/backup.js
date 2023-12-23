const fs = require('fs');
const { exec } = require('child_process');
const { google } = require('googleapis');

function backupDatabase() {
  exec('mongodump --db SE_Project1 --out C:\Users\DaWitchBtch', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error backing up database: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Backup process encountered an error: ${stderr}`);
      return;
    }
    console.log(`Database backup successful: ${stdout}`);
    // Call function to upload to Google Drive after backup completion
    uploadToGoogleDrive('C:/Users/DaWitchBtch/Documents/Backup-SE_Project1/SE_Project1');
  });
}
function uploadToGoogleDrive(backupFolderPath) {
    const credentials = {
      client_id: '512042771332-tkqr69nuq3mg7jhaifj3sb6uihearigc.apps.googleusercontent.com',
      client_secret: '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',
      redirect_uris: ['http://localhost:5173/'],
    };
  
    const oAuth2Client = getOAuth2Client(credentials);
    const drive = google.drive({ version: 'v3', auth: oAuth2Client });
  
    const fileMetadata = {
      name: 'YourDatabaseBackup.zip', // Customize filename as needed
      mimeType: 'application/zip',
    };
  
    const media = {
      mimeType: 'application/zip',
      body: fs.createReadStream(`${backupFolderPath}.zip`), // Assuming backup is zipped
    };
  
    drive.files.create(
      {
        resource: fileMetadata,
        media: media,
        fields: 'id',
      },
      (err, file) => {
        if (err) {
          console.error('Error uploading file to Google Drive:', err);
          return;
        }
        console.log('File uploaded to Google Drive with ID:', file.data.id);
      }
    );
  }
  
  function getOAuth2Client(credentials) {
    const { client_secret, client_id, redirect_uris } = credentials;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
  
    try {
      // For simplicity, I'll simulate token handling with empty token object
      const token = {};
      oAuth2Client.setCredentials(token);
    } catch (error) {
      console.error('Error loading token:', error);
    }
  
    return oAuth2Client;
  }
  
module.exports = { backupDatabase };
