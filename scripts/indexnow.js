const host = 'tool.dogupup.com';
const key = '3ea8572ca3c542fab00d5d21b36008c9';
const keyLocation = `https://${host}/${key}.txt`;

const routes = [
  '',
  '/maven-tree',
  '/sql-to-pojo',
  '/cron',
  '/log-config',
  '/jvm-tuning',
];

const urlList = routes.map(route => `https://${host}${route}`);

async function submitToIndexNow() {
  console.log('Submitting URLs to IndexNow (Bing)...');
  console.log('URLs:', urlList);

  try {
    const response = await fetch('https://www.bing.com/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        host,
        key,
        keyLocation,
        urlList,
      }),
    });

    if (response.ok) {
      console.log('Successfully submitted to IndexNow!');
    } else {
      const data = await response.text();
      console.error('Failed to submit to IndexNow. Status:', response.status, data);
    }
  } catch (error) {
    console.error('Error submitting to IndexNow:', error.message);
  }
}

submitToIndexNow();
