const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const Dropbox = require('dropbox').Dropbox;

const dbx = new Dropbox({ accessToken: 'sl.BseT-w6O1FYGIU0xXMikUgj_vynDdbyXTaDEF5HStlMtQHb-KFuxE-glyqD0JNn4iC9AFa1tXapF9cWdAPjA6_0YvUfPhUDNusNCE2IySShSDVMOLvol8AU9q8DDviVO0X20f_64xlh_e-vEY98P', fetch: fetch });

async function uploadToDropbox(folderPath) {
  try {

    // List all files in the folder
    const files = fs.readdirSync(folderPath);

    // Iterate through each file and upload to Dropbox
    for (const file of files) {
      const filePath = `${folderPath}/${file}`;
      const fileContent = fs.readFileSync(filePath);

      // Specify the file path in Dropbox
      const dropboxPath = `/SE_Project/${file}`; // Change 'SE_Project' to your desired folder name

      // Upload the file to Dropbox
      const response = await dbx.filesUpload({ path: dropboxPath, contents: fileContent });
      console.log('File uploaded to Dropbox:', response);
    }

    console.log('Folder uploaded to Dropbox.');
  } catch (error) {
    console.error('Error uploading folder to Dropbox:', error);
  }
}

async function backupAndSaveLocally() {
  try {
    // Backup database
    const { stdout, stderr } = await exec('mongodump --db SE_Project1 --out C:\\Users\\DaWitchBtch\\Documents\\SE_Project_Backup');

    console.log('stdout:', stdout);
    console.error('stderr:', stderr);

    // Upload to Dropbox
    await uploadToDropbox('C:\\Users\\DaWitchBtch\\Documents\\SE_Project_Backup\\SE_Project1');

    console.log('Backup completed successfully. Saved locally. Uploaded to Dropbox. visit: https://www.dropbox.com/home/Apps/SE_HelpDesk/SE_Project');
  } catch (error) {
    console.error('Error during backup:', error);
  }
}
// async function restoreFromDropbox() {
//   try {
//     const folderPath = '/SE_Project'; // Change this to the folder path in Dropbox where your backups are stored
//     const { entries } = await dbx.filesListFolder({ path: folderPath });

//     // Iterate through each file in the Dropbox folder
//     if (response && response.result && response.result.entries) {
//       const entries = response.result.entries;

//       for (const entry of entries) {
//         if (entry['.tag'] === 'file') {
//           const filePath = entry.path_lower;
//           const responseFile = await dbx.filesDownload({ path: filePath });
//           const fileContent = responseFile.result.fileBinary;

//           // Process the file content as needed and save it to MongoDB
//           // For example, if the content is a MongoDB dump, you might use mongorestore
//           // Here's an example assuming the fileContent is a BSON dump:
//           await exec(`mongorestore --db SE_Project1 --drop --archive`, {
//             input: fileContent,
//           });
//         }
//       }
//     }


//     console.log(`Restored data from ${filePath} to MongoDB.`);
//   } catch (error) {
//     console.error('Error restoring data from Dropbox:', error);
//     throw error;
//   }
// }

module.exports = { backupAndSaveLocally };
