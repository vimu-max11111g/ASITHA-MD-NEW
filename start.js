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

console.log("✅ Starting index.js...");

// `index.js` එක normal විදියට start කරන්න
const indexProcess = exec('node index.js');

indexProcess.stdout.on('data', (data) => {
    console.log(`📜 index.js Log: ${data}`);
});

indexProcess.stderr.on('data', (data) => {
    console.error(`❌ index.js Error: ${data}`);
});
    })
    .catch(error => {
        console.error('Error downloading files:', error);
    });
