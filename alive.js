// import fetch from 'node-fetch';
const fetch=require('node-fetch');
// import cron from 'node-cron';
const cron=require('node-cron');


// Function to make the request
async function keepAlive() {
  try {
    const response = await fetch('http://dailyratlam.in');
    if (response.ok) {
      console.log('Server is alive:', new Date());
    } else {
      console.log('Server returned an error:', response.status, new Date());
    }
  } catch (error) {
    console.error('Error making request:', error, new Date());
  }
}

// Schedule the task to run every 14 minutes
cron.schedule('*/14 * * * *', () => {
  console.log('Running keepAlive task:', new Date());
  keepAlive();
});

// Initial call to keep the server alive immediately when the script starts
keepAlive();
