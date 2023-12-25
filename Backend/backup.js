// const fs = require('fs');
// const util = require('util');
// const exec = util.promisify(require('child_process').exec);
// const Dropbox = require('dropbox').Dropbox;

// const dbx = new Dropbox({ accessToken: 'sl.BsT0J-p9NlZF_qzRHIclImTpdAsoe3FR_3oLOIHvhYmTSKLbAJ8e3OELT2UyAhey5_LqtzF8WA3iyg6I_9E7mZJ5GwU-VqPNyra1TC5o_KrpzQmUatAY_YEZoMZCAZm3ctlcNzVzxvPWnCKbOiTF', fetch: fetch });

// async function uploadToDropbox(folderPath) {
//   try {
//     // List all files in the folder
//     const files = fs.readdirSync(folderPath);

//     // Iterate through each file and upload to Dropbox
//     for (const file of files) {
//       const filePath = `${folderPath}/${file}`;
//       const fileContent = fs.readFileSync(filePath);

//       // Specify the file path in Dropbox
//       const dropboxPath = `/SE_Project/${file}`; // Change 'SE_Project' to your desired folder name

//       // Upload the file to Dropbox
//       const response = await dbx.filesUpload({ path: dropboxPath, contents: fileContent });
//       console.log('File uploaded to Dropbox:', response);
//     }

//     console.log('Folder uploaded to Dropbox.');
//   } catch (error) {
//     console.error('Error uploading folder to Dropbox:', error);
//   }
// }

// async function backupAndSaveLocally() {
//   try {
//     // Backup database
//     const { stdout, stderr } = await exec('mongodump --db SE_Project1 --out C:\\Users\\DaWitchBtch\\Documents\\SE_Project_Backup');

//     console.log('stdout:', stdout);
//     console.error('stderr:', stderr);

//     // Upload to Dropbox
//     await uploadToDropbox('C:\\Users\\DaWitchBtch\\Documents\\SE_Project_Backup\\SE_Project1');

//     console.log('Backup completed successfully. Saved locally. Uploaded to Dropbox. visit: https://www.dropbox.com/home/Apps/SE_HelpDesk/SE_Project');
//   } catch (error) {
//     console.error('Error during backup:', error);
//   }
// }

// module.exports = { backupAndSaveLocally };
