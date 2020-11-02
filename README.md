# Minority Groups in Congress
### Created by Rita Bennett-Chew

An app built to practice and learn Vue and D3. In addition, this site was created to visualize trends of politicians in minority groups serving in Congress. See the [live site](https://minority-groups-in-congress.herokuapp.com/timeline) for more information.

## Tools Used
- Vue, Vue CLI
- D3
- Bootstrap, Bootstrap-Vue
- Heroku
- Data from [history.house.gov](https://history.house.gov/)

## Completed Features
- Timeline which visually shows the number of people serving in each Congress session who belong to the selected minority group. (A 'minority group' here is definied as a demographic group which has historically made up a minority of the total politicians in Congress) 
- The ability to optionally show Congress members in each session by political party (Democrat or Republican or Other)
- A sidebar with extra information about the project
- Responsive design

## TODO Features
- Addition of events to the left of the timeline axis. Events would be relevant to each minority group. I'll start with Amendments passed and Major Acts of Congress (again, data from [history.house.gov](https://history.house.gov/)), and can expand from there
- Tooltips with data on each Congress member to appear upon hover of each dot

## To Serve Locally
1. Fork and clone the [repo](https://github.com/ritabc/congress-groups)
1. run `npm install` to install dependencies
1. To launch: `npm run serve`
1. To run unit tests: `npm run test:unit`
1. To compile and minify for production: `npm run build`

Licensed under the MIT license.