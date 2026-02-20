import { TIMEOUT_SEC } from './config.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    // Conditionally initialize fetch
    const fetchPro = uploadData
      ? await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : await fetch(url);

    // Consuming promise via await
    const response = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await response.json();

    // Checking if response was successful
    if (!response.ok) throw new Error(`${data.message} ${response.status}`);
    return data;
  } catch (err) {
    throw err;
  }
};

/*

export const getJSON = async function (url) {
  try {
    // Making an API request
    const response = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);

    // Consuming promise via await
    const data = await response.json();

    // Throwing error in the case of unsuccessfull request
    if (!response.ok) throw new Error(`${data.message} ${response.status}`);
    return data;
  } catch (err) {
    throw err;
  }
};

export const sendJSON = async function (url, uploadData) {
  try {
    // Sending An API
    const post = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData),
    });

    // Consuming promise via await
    const response = await Promise.race([post, timeout(TIMEOUT_SEC)]);
    const data = await response.json();

    if (!response.ok) throw new Error(`${data.message} ${response.status}`);
    return data;
  } catch (err) {
    console.error(err);
  }
};


*/
