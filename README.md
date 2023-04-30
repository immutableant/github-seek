# Github Seek

Github Seek is a simple search engine for repositories and users on Github built with React, Apollo Client, and Github's GraphQL API.

## Getting Started

To run the project, clone the repository and run the following commands:
```bash
npm install
npm start
```

This will start the development server on `http://localhost:3000`.

Before running the app, you need to set up your Github API access token and include it in the `.env.local` file in the root directory of the project. You can obtain your token by following the instructions [here](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token). The token should be set as the value for the `REACT_APP_GITHUB_API_TOKEN` environment variable.

## Usage

Github Seek allows you to search for repositories and users on Github by entering a search query. You can perform a search by typing in the search bar and hitting the Enter key or by clicking the Search button.

You can search for repositories and users separately by selecting the appropriate option from the dropdown menu next to the search bar.

## Technologies

Github Seek is built using the following technologies:

- React: Frontend library for building user interfaces
- Apollo Client: GraphQL client for fetching data from the Github API
- GraphQL: Query language for APIs
- React Bootstrap: UI component library for React
- React Router: Library for handling routing in React
