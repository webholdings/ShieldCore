import { db } from './db';

async function checkAddictions() {
    try {
        console.log('Checking addictions collection...\n');

        // Get all addictions without any filters
        const snapshot = await db.collection('addictions').get();

        console.log(`Total addictions in database: ${snapshot.size}\n`);

        snapshot.forEach((doc) => {
            const data = doc.data();
            console.log('Addiction ID:', doc.id);
            console.log('Data:', JSON.stringify(data, null, 2));
            console.log('---');
        });

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkAddictions();
