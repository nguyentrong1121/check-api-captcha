const axios = require('axios');

// List of barcode data
const data = [
    "8938548776328", "8938525657664", "8936195690967", /*... all other barcodes ...*/
];

// Default auth token
const defaultAuthToken = '335cdee8-f30e-400b-af63-613fda13d462';

// Function to prompt the user for input using process.stdin (no external libraries)
function prompt(question) {
    return new Promise(resolve => {
        process.stdout.write(question);
        process.stdin.once('data', data => resolve(data.toString().trim()));
    });
}

// Function to get authToken, using default if not provided by the user
async function getAuthToken() {
    const inputToken = await prompt('Please enter your authToken (or press Enter to use default): ');
    return inputToken || defaultAuthToken; // Use default if no input provided
}

async function startScan(authToken) {
    let isLoading = true;
    console.log('Loading...', isLoading);

    const request = axios.create({
        headers: {
            "Authorization": 'Bearer ' + authToken,
            "Host": "api-social.icheck.com.vn",
            "lon": "105.83881873307597",
            "Accept": "*/*",
            "device-id": "702161682e4cb512e1af441a850c57ac",
            "appVersion": "6.85.0",
            "Accept-Language": "en-GB,en;q=0.9",
            "lat": "20.99175374941804",
            "platform": "ios",
            "Accept-Encoding": "gzip, deflate, br",
            "User-Agent": "ios/vn.icheck.ios/6.85.0(241211.1) iPhone/iOS 17.2.1",
            "Connection": "keep-alive",
            "Content-Type": "application/json"
        },
        baseURL: 'https://api-social.icheck.com.vn/social/api/',
    });

    try {
        // Fetch history
        const { data: history } = await request.post('history-action/scan/query', {
            "offshopId": [],
            "limit": 10,
            "sort": 2,
            "offset": 0,
            "actionType": []
        });

        const lastBar = history?.data?.rows?.[0]?.product?.barcode;
        const lastIndex = data.indexOf(lastBar);

        let historyLength = history?.data?.rows?.length || 0;
        console.log(`History length: ${historyLength}`);

        // Start scanning from the last scanned barcode in history
        for (let i = lastIndex + 1; i < data.length; i++) {
            await request.post('products/scan', {
                "barcodeType": "ean13",
                "layout": "product-detail",
                "phone": "84359530143",
                "isScan": true,
                "barcode": data[i]
            });
            console.log(`Scanned barcode: ${data[i]}`);
            await sleep(getRandomNumber(6500, 14000)); // Random delay between scans
        }
    } catch (error) {
        console.error('Error during scan:', error);
    } finally {
        isLoading = false;
        console.log('Loading finished', isLoading);
    }
}

// Function to fetch scan history every 60 seconds
const fetchScanHistory = async (authToken) => {
    console.log("Fetching scan history...");

    const request = axios.create({
        headers: {
            "Authorization": 'Bearer ' + authToken,
            "Host": "api-social.icheck.com.vn",
            "lon": "105.83881873307597",
            "Accept": "*/*",
            "device-id": "702161682e4cb512e1af441a850c57ac",
            "appVersion": "6.85.0",
            "Accept-Language": "en-GB,en;q=0.9",
            "lat": "20.99175374941804",
            "platform": "ios",
            "Accept-Encoding": "gzip, deflate, br",
            "User-Agent": "ios/vn.icheck.ios/6.85.0(241211.1) iPhone/iOS 17.2.1",
            "Connection": "keep-alive",
            "Content-Type": "application/json"
        },
        baseURL: 'https://api-social.icheck.com.vn/social/api/',
    });

    try {
        const { data: history } = await request.post('history-action/scan/query', {
            "offshopId": [],
            "limit": 10,
            "sort": 2,
            "offset": 0,
            "actionType": []
        });

        const lastBar = history?.data?.rows?.[0]?.product?.barcode;
        console.log("Last scanned barcode:", lastBar);
    } catch (error) {
        console.error("Error while fetching scan history:", error);
    }
};

// Sleep function to add delay between scans
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Random number generator for delays
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Main execution
async function main() {
    const authToken = await getAuthToken(); // Get authToken either from user input or default
    startScan(authToken); // Start scanning

    // Fetch scan history every 60 seconds
    setInterval(() => fetchScanHistory(authToken), 60000);
}

main(); // Run the main function
