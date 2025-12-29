const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env and .env.local
function loadEnv() {
    const envFiles = ['.env', '.env.local'];
    const loaded = {};

    envFiles.forEach(file => {
        const filePath = path.join(process.cwd(), file);
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');
            content.split('\n').forEach(line => {
                // Simple regex to match KEY=VALUE
                const match = line.match(/^\s*([\w_]+)\s*=\s*(.*)?\s*$/);
                if (match) {
                    const key = match[1];
                    let value = match[2] || '';
                    // Remove wrapping quotes if present
                    if ((value.startsWith('"') && value.endsWith('"')) ||
                        (value.startsWith("'") && value.endsWith("'"))) {
                        value = value.slice(1, -1);
                    }
                    // Don't overwrite existing env vars
                    if (!process.env[key]) {
                        process.env[key] = value;
                        loaded[key] = value;
                    }
                }
            });
        }
    });
}

loadEnv();

const ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const BUCKET_NAME = process.env.R2_BUCKET_NAME;

if (!ACCOUNT_ID || !ACCESS_KEY_ID || !SECRET_ACCESS_KEY || !BUCKET_NAME) {
    console.error('Error: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, and R2_BUCKET_NAME must be set.');
    process.exit(1);
}

const client = new S3Client({
    region: 'auto',
    endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: ACCESS_KEY_ID,
        secretAccessKey: SECRET_ACCESS_KEY,
    },
});

const DATA_DIR = path.join(process.cwd(), 'data');

async function uploadFile(filename) {
    const filePath = path.join(DATA_DIR, filename);
    const content = fs.readFileSync(filePath, 'utf8');

    console.log(`Uploading ${filename} to R2 bucket ${BUCKET_NAME}...`);

    try {
        const command = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: filename,
            Body: content,
            ContentType: 'application/json',
        });

        await client.send(command);
        console.log(`Successfully uploaded ${filename}`);
    } catch (err) {
        console.error(`Failed to upload ${filename}:`, err);
        process.exitCode = 1;
    }
}

async function main() {
    if (!fs.existsSync(DATA_DIR)) {
        console.error(`Data directory not found at ${DATA_DIR}`);
        process.exit(1);
    }

    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));

    if (files.length === 0) {
        console.log('No .json files found in data directory.');
        return;
    }

    console.log(`Found ${files.length} json files to upload from ${DATA_DIR}`);

    // Upload concurrently
    await Promise.all(files.map(file => uploadFile(file)));

    console.log('Done.');
}

main();
