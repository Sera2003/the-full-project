import axios from 'axios';

// GitHub Info
const GITHUB_TOKEN = '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'; // Replace with your token
const GITHUB_USERNAME = 'Sera2003'; // Your GitHub username
const GITHUB_REPO = 'WolfFitness'; // Your GitHub repo name

const githubConnect = async () => {
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}`,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );
    
    if (response.status === 200) {
      console.log('GitHub repository connected successfully:', response.data.full_name);
    }
  } catch (error) {
    console.error('Error connecting to GitHub:', error.message);
  }
};

// Call the function to check connection
githubConnect();
