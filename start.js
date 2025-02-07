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
        exec('node index.js', (error, stdout, stderr) => {
    if (error) {
        console.error(`Error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});
    })
    .catch(error => {
        console.error('Error downloading files:', error);
    });
