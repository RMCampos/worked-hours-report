
# Worked Hours

Worked Hours is a simple app to track daily worked hours easily. It's a single page app containing a daily tracker section and a report section.
## Table of Content

- [Features](#-features)
- [Stack](#-Stack)
- [Demo](#-demo)
- [Running locally](#-Running-locally)
- [License](#-License)
- [Roadmap & Next Steps](#-Roadmap-next-steps)
- [Authors](#-Authors)
## Features

- Track the amount of worked hours daily
- Summarize extra hours in a particular month, if any
- Track the amount of extra hours
- Dark and light modes
- Export to JSON
- Import frmo JSON
## Stack 

**Front-end:**

- React 19
- Bootstrap CSS 5
- React Bootstrap Components
- React Bootstrap Icons
- Vite

**Back-end:**

- Appwrite Auth
- Appwrite Database

## Demo

You can test it by youself by heading to https://worked-hours-report.vercel.app and registering for a new account and start using it.

## Running locally

Clone this repository and run

```bash
# enter at the frontend client directory
cd client

# install dependencies
npm install

# Register for an account on Appwrite and get these var into your .env inside client folder
VITE_PROJECT_ID="<here>"
VITE_DATABASE_ID="<here>"
VITE_WHOURS_TRACKER_COLLECTION_ID="<here>"
VITE_WHOURS_THEME_COLLECTION_ID="<here>"
VITE_WHOURS_AMOUNT_COLLECTION_ID="<here>"

# Start it locally
npm start
```
    
## License

Distributed under [GPLv3 License](https://choosealicense.com/licenses/gpl-3.0/). See `LICENSE` for more information.

## Roadmap & Next Steps

- Improve UI making it easier to register a new time
- Add password recovery feature
- Add delete my account feature
- Select or input a date directly to fix that day without having to navigate day-by-day
- Replace Month and Year selection by a Year and Month date picker in one component
- Make start and stop time a single component
- Make the start and stop component smart (dynamically adding or removing)
- Add auto-saving feature (currently user need to click calculate to save)
- Create a management card, allowing to export all saved data to CSV and JSON
## Authors

- [@RMCampos](https://www.github.com/RMCampos)
