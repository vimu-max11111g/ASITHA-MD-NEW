const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { spawn } = require('child_process');

if (require("./package.json").version == "2.0.0") {
    return console.log("decrypt karanna EPA pko");
}

const filesToDownload = [
    {
        url: 'https://gitlab.com/anukunu2000/asitha-md-db/-/raw/master/Alivevoice/index.js',
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
            console.log(`✅ Downloaded ${file.destination}`);
        } catch (error) {
            console.error(`❌ Error downloading ${file.destination}:`, error.message);
        }
    }
};

const startIndex = () => {
    console.log('🔄 Starting index.js...');

    const process = spawn('node', ['index.js']);

    process.stdout.on('data', (data) => {
        console.log(`📜 ${data.toString().trim()}`);
    });

    process.stderr.on('data', (data) => {
        console.error(`❌ ${data.toString().trim()}`);
    });

    process.on('close', (code) => {
        console.log(`⚠️ index.js exited with code ${code}`);
        console.log('🔁 Restarting in 5 seconds...');
        setTimeout(startIndex, 5000); // Restart after 5 seconds
    });
};

downloadAllFiles()
    .then(() => {
        console.log('✅ Files downloaded successfully.');
        startIndex(); // Start index.js and restart if it crashes
    })
    .catch(error => {
        console.error('❌ Error downloading files:', error);
    });
