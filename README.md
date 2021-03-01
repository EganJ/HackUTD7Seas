## Inspiration
Americans aren't saving nearly as much as they should! This is partially because of our spending habits: many people aren't fully in control of their spending because they don't take the time to review their expenses. A web app that reminds users to review their expenses encourages reflection on spending, which will help people build and stick to their budget.
## What it does
Using Capitol One's hackathon api, fetch expense history and ask the user to reflect on it necessity and categorization, helping the user reflect on their decisions. Using the user response, perform analysis on what can be improved about their spending habits based on generic rule-of-thumbs.

You can try it out at https://eganj.github.io/HackUTD7Seas/ but note that this is a static version, so none of the data will update there's no connection between the inputted data and the analyzed data on the second page.
## How we built it
Launched from a Node.js/Express server, this project currently runs as a webpage, but can easily be turned into a progressive web app. The server makes enterprise requests to Capitol One's Nessie api and uses that information to build the user expense profile.
## Challenges we ran into
Although the Nessie documentation shows that you should be able to fetch a customers accounts using their customer id to fetch their customer data and similarly fetch bill information from an account id, the response data were missing those fields. However, the account number is listed in the bill data and the customer number is listed in the account data. In order to re-construct those relations, the server on launch looks through all bills and accounts and uses that reverse relationship to build a registry of bills and accounts per user.
Additionally, the example data is rather sparse, so I had to fudge it a little to create a convicing user history by combining multiple users transaction data (just for the demo).
## Accomplishments that we're proud of
I am overall very happy with my workflow for this project. I took the time at the beginning to sit down and diagram my project, and made sure that the fundamental components were robust and well-documented, saving me a lot of time and effort. I'm also proud of how my final result looks: I'm not skilled in html or css, and it's the best-looking functional webpage I've made in a long time.
## What we learned
I've sure gotten a lot better at JavaScript promises and ansyc operations, and gotten a little more comfortable with bootstrap and css. Since this is my first hackathon, I've also learned how great of an experience this is!
## What's next for Personal Expense Analysis
In order to make this app most useful, it should be integrated into a progressive web app and notifications should be set up to remind the user to check-in regularly. Once this is done, storing past user inputs to reduce redundant forms would also make the app easier and faster to use.
