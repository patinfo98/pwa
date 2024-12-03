/*  
AUTHORS: Müslüm Atas & Mathias Knoll
DESCRIPTION: The implementation of webworker. 
LAST CHANGE: 17.10.2023
*/

self.addEventListener("message", function (messageEvent) {
  if (messageEvent.data === "init") {
    getData()
  }
});


async function getData() {
  let returnData = {
      polls: [],
      user: null,
  };

  try {
      // Fetching the polls data
      const pollsResponse = await fetch('data_polls.json');
      if (!pollsResponse.ok) throw new Error('Failed to fetch data_polls.json');
      returnData.polls = await pollsResponse.json();

      // Fetching the user data
      const userResponse = await fetch('user.json');
      if (!userResponse.ok) throw new Error('Failed to fetch user.json');
      returnData.user = await userResponse.json();
  } catch (error) {
      console.error('Error fetching data:', error);
  }

  // Send the data back to the main thread
  self.postMessage(returnData);
}