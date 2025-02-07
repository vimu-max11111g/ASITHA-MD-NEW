const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { exec } = require('child_process');

const filesToDownload = [
    {
        url: 'https://raw.githubusercontent.com/asithamd173/ASITHA-MD-DETA/main/Alivevoice/index.js',
        destination: './index.js'
    }
];

const downloadFile = async (url, destination) => {
    const writer = fs.createWriteStream(destination);
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
    });
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
};

const downloadAllFiles = async () => {
    for (const file of filesToDownload) {
        try {
            await downloadFile(file.url, path.resolve(__dirname, file.destination));
            console.log(`Downloaded ${file.destination}`);
        } catch (error) {
            console.error(`Error downloading ${file.destination}:`, error.message);
        }
    }
};

downloadAllFiles()
    .then(() => {

console.log("✅ Starting index.js with PM2...");

// PM2 start කරන්න
exec('pm2 start index.js --name ASITHA', (error, stdout, stderr) => {
    if (error) {
        console.error(`❌ Error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`⚠️ stderr: ${stderr}`);
        return;
    }
    console.log(`✅ stdout: ${stdout}`);

    // PM2 logs continuously print කරන්න
    const pm2Logs = exec('pm2 logs ASITHA');

    pm2Logs.stdout.on('data', (data) => {
        console.log(`📜 PM2 Log: ${data}`);
    });

    pm2Logs.stderr.on('data', (data) => {
        console.error(`❌ PM2 Error: ${data}`);
    });
});
    })
    .catch(error => {
        console.error('Error downloading files:', error);
    });
