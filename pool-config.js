/**
 * pool-config.js
 * =====================================================
 * Edit THIS FILE to set up your pool participants and
 * their golfer picks. No other files need changing.
 * =====================================================
 */

// ----------------------------------------------------
// POOL PARTICIPANTS
// Each participant has a name and exactly 6 golfer picks.
// Golfer names must match the firstName + lastName exactly
// as they appear on the PGA Tour / RapidAPI leaderboard.
// ----------------------------------------------------
const POOL_PARTICIPANTS = [
  {
    name: "Adam, Colin",
    // Alternate (use if a pick WDs): Patrick Reed
    picks: [
      { firstName: "Bryson", lastName: "DeChambeau" },
      { firstName: "Matt", lastName: "Fitzpatrick" },
      { firstName: "Ludvig", lastName: "Aberg" },
      { firstName: "Robert", lastName: "MacIntyre" },
      { firstName: "Min Woo", lastName: "Lee" },
      { firstName: "Jordan", lastName: "Spieth" },
    ],
  },
  {
    name: "Alcorn, Jeff #1",
    // Alternate (use if a pick WDs): Min Woo Lee
    picks: [
      { firstName: "Scottie", lastName: "Scheffler" },
      { firstName: "Jon", lastName: "Rahm" },
      { firstName: "Ludvig", lastName: "Aberg" },
      { firstName: "Jacob", lastName: "Bridgeman" },
      { firstName: "Hideki", lastName: "Matsuyama" },
      { firstName: "Jordan", lastName: "Spieth" },
    ],
  },
  {
    name: "Alcorn, Jeff #2",
    // Alternate (use if a pick WDs): Hideki Matsuyama
    picks: [
      { firstName: "Jon", lastName: "Rahm" },
      { firstName: "Matt", lastName: "Fitzpatrick" },
      { firstName: "Jacob", lastName: "Bridgeman" },
      { firstName: "Min Woo", lastName: "Lee" },
      { firstName: "Ludvig", lastName: "Aberg" },
      { firstName: "Jordan", lastName: "Spieth" },
    ],
  },
  {
    name: "Barp, Eric",
    // Alternate (use if a pick WDs): Viktor Hovland
    picks: [
      { firstName: "Cameron", lastName: "Young" },
      { firstName: "Xander", lastName: "Schauffele" },
      { firstName: "Ludvig", lastName: "Aberg" },
      { firstName: "Robert", lastName: "MacIntyre" },
      { firstName: "Akshay", lastName: "Bhatia" },
      { firstName: "Hideki", lastName: "Matsuyama" },
    ],
  },
  {
    name: "Barp, Tyler",
    // Alternate (use if a pick WDs): Jacob Bridgeman
    picks: [
      { firstName: "Matt", lastName: "Fitzpatrick" },
      { firstName: "Tommy", lastName: "Fleetwood" },
      { firstName: "Ludvig", lastName: "Aberg" },
      { firstName: "Viktor", lastName: "Hovland" },
      { firstName: "Min Woo", lastName: "Lee" },
      { firstName: "Jake", lastName: "Knapp" },
    ],
  },
  {
    name: "Bates, Adam",
    // Alternate (use if a pick WDs): Corey Conners
    picks: [
      { firstName: "Bryson", lastName: "DeChambeau" },
      { firstName: "Rory", lastName: "McIlroy" },
      { firstName: "Shane", lastName: "Lowry" },
      { firstName: "Akshay", lastName: "Bhatia" },
      { firstName: "Ludvig", lastName: "Aberg" },
      { firstName: "Patrick", lastName: "Reed" },
    ],
  },
  {
    name: "Beecher, Bryce",
    // Alternate (use if a pick WDs): Corey Conners
    picks: [
      { firstName: "Cameron", lastName: "Young" },
      { firstName: "Justin", lastName: "Rose" },
      { firstName: "Ludvig", lastName: "Aberg" },
      { firstName: "Justin", lastName: "Thomas" },
      { firstName: "Hideki", lastName: "Matsuyama" },
      { firstName: "Viktor", lastName: "Hovland" },
    ],
  },
  {
    name: "Beecher, Russ",
    // Alternate (use if a pick WDs): Sepp Straka
    picks: [
      { firstName: "Scottie", lastName: "Scheffler" },
      { firstName: "Tommy", lastName: "Fleetwood" },
      { firstName: "Patrick", lastName: "Reed" },
      { firstName: "Ludvig", lastName: "Aberg" },
      { firstName: "Nicolai", lastName: "Hojgaard" },
      { firstName: "Min Woo", lastName: "Lee" },
    ],
  },
  {
    name: "Bennett, Nick",
    // Alternate (use if a pick WDs): Viktor Hovland
    picks: [
      { firstName: "Scottie", lastName: "Scheffler" },
      { firstName: "Cameron", lastName: "Young" },
      { firstName: "Ludvig", lastName: "Aberg" },
      { firstName: "Min Woo", lastName: "Lee" },
      { firstName: "Patrick", lastName: "Reed" },
      { firstName: "Hideki", lastName: "Matsuyama" },
    ],
  },
  {
    name: "Bianchi, Keegan",
    // Alternate (use if a pick WDs): Max Homa
    picks: [
      { firstName: "Xander", lastName: "Schauffele" },
      { firstName: "Tommy", lastName: "Fleetwood" },
      { firstName: "Akshay", lastName: "Bhatia" },
      { firstName: "Adam", lastName: "Scott" },
      { firstName: "Ludvig", lastName: "Aberg" },
      { firstName: "Partick", lastName: "Cantlay" },
    ],
  },
  {
    name: "Biegger, Brad",
    // Alternate (use if a pick WDs): Jason Day
    picks: [
      { firstName: "Scottie", lastName: "Scheffler" },
      { firstName: "Rory", lastName: "McIlroy" },
      { firstName: "Max", lastName: "Homa" },
      { firstName: "Ludvig", lastName: "Aberg" },
      { firstName: "Hideki", lastName: "Matsuyama" },
      { firstName: "Jacob", lastName: "Bridgeman" },
    ],
  },
  {
    name: "Biegger, Matt",
    // Alternate (use if a pick WDs): Jason Day
    picks: [
      { firstName: "Rory", lastName: "McIlroy" },
      { firstName: "Cameron", lastName: "Young" },
      { firstName: "Sepp", lastName: "Straka" },
      { firstName: "Min Woo", lastName: "Lee" },
      { firstName: "Jake", lastName: "Knapp" },
      { firstName: "Nicolai", lastName: "Hojgaard" },
    ],
  },
  {
    name: "Biegger, Mike",
    // Alternate (use if a pick WDs): Akshay Bhatia
    picks: [
      { firstName: "Tommy", lastName: "Fleetwood" },
      { firstName: "Justin", lastName: "Rose" },
      { firstName: "Ludvig", lastName: "Aberg" },
      { firstName: "Min Woo", lastName: "Lee" },
      { firstName: "Nicolai", lastName: "Hojgaard" },
      { firstName: "Robert", lastName: "MacIntyre" },
    ],
  },
  {
    name: "Brosnahan, William",
    note: "Joaquin Niemann WD (Alternate Max Homa used)",
    // Alternate (use if a pick WDs): Max Homa
    picks: [
      { firstName: "Rory", lastName: "McIlroy" },
      { firstName: "Bryson", lastName: "DeChambeau" },
      { firstName: "Min Woo", lastName: "Lee" },
      { firstName: "Ludvig", lastName: "Aberg" },
      { firstName: "Joaquin", lastName: "Niemann" },
      { firstName: "Hideki", lastName: "Matsuyama" },
    ],
  },
  {
    name: "Buddecke, Don",
    // Alternate (use if a pick WDs): Cameron Smith
    picks: [
      { firstName: "Scottie", lastName: "Scheffler" },
      { firstName: "Bryson", lastName: "DeChambeau" },
      { firstName: "Ludvig", lastName: "Aberg" },
      { firstName: "Shane", lastName: "Lowry" },
      { firstName: "Akshay", lastName: "Bhatia" },
      { firstName: "Justin", lastName: "Rose" },
    ],
  },
  {
    name: "Chamberlin, Ryan",
    // Alternate (use if a pick WDs): Akshay Bhatia
    picks: [
      { firstName: "Scottie", lastName: "Scheffler" },
      { firstName: "Jon", lastName: "Rahm" },
      { firstName: "Min Woo", lastName: "Lee" },
      { firstName: "Ludvig", lastName: "Aberg" },
      { firstName: "Patrick", lastName: "Reed" },
      { firstName: "Hideki", lastName: "Matsuyama" },
    ],
  },
  {
    name: "Chapman, Graham",
    // Alternate (use if a pick WDs): Robert MacIntyre
    picks: [
      { firstName: "Xander", lastName: "Schauffele" },
      { firstName: "Jon", lastName: "Rahm" },
      { firstName: "Ludvig", lastName: "Aberg" },
      { firstName: "Hideki", lastName: "Matsuyama" },
      { firstName: "Akshay", lastName: "Bhatia" },
      { firstName: "Patrick", lastName: "Reed" },
    ],
  },
  {
    name: "Coenen, Amy",
    // Alternate (use if a pick WDs): Brooks Koepka
    picks: [
      { firstName: "Scottie", lastName: "Scheffler" },
      { firstName: "Bryson", lastName: "DeChambeau" },
      { firstName: "Jacob", lastName: "Bridgeman" },
      { firstName: "Min Woo", lastName: "Lee" },
      { firstName: "Patrick", lastName: "Reed" },
      { firstName: "Akshay", lastName: "Bhatia" },
    ],
  },
  {
    name: "Coleman, Eric",
    // Alternate (use if a pick WDs): Akshay Bhatia
    picks: [
      { firstName: "Cameron", lastName: "Young" },
      { firstName: "Xander", lastName: "Schauffele" },
      { firstName: "Ludvig", lastName: "Aberg" },
      { firstName: "Robert", lastName: "MacIntyre" },
      { firstName: "Hideki", lastName: "Matsuyama" },
      { firstName: "Partrick", lastName: "Reed" },
    ],
  },
  {
    name: "Conley, Kevin",
    // Alternate (use if a pick WDs): Robert MacIntyre
    picks: [
      { firstName: "Bryson", lastName: "DeChambeau" },
      { firstName: "Xander", lastName: "Schauffele" },
      { firstName: "Ludvig", lastName: "Aberg" },
      { firstName: "Patrick", lastName: "Reed" },
      { firstName: "Akshay", lastName: "Bhatia" },
      { firstName: "Jordan", lastName: "Spieth" },
    ],
  },
  {
    name: "Cooling, Nick",
    // Alternate (use if a pick WDs): Fred Couples
    picks: [
      { firstName: "Justin", lastName: "Rose" },
      { firstName: "Rory", lastName: "McIlroy" },
      { firstName: "Ludvig", lastName: "Aberg" },
      { firstName: "Jake", lastName: "Knapp" },
      { firstName: "Hideki", lastName: "Matsuyama" },
      { firstName: "Brian", lastName: "Harman" },
    ],
  },
  {
    name: "Corell, Charlie",
    // Alternate (use if a pick WDs): Brian Harman
    picks: [
      { firstName: "Bryson", lastName: "DeChambeau" },
      { firstName: "Scottie", lastName: "Scheffler" },
      { firstName: "Jason", lastName: "Day" },
      { firstName: "Jake", lastName: "Knapp" },
      { firstName: "Tyrrell", lastName: "Hatton" },
      { firstName: "Shane", lastName: "Lowry" },
    ],
  },
  {
    name: "Corell, Grant",
    // Alternate (use if a pick WDs): Tyrrell Hatton
    picks: [
      { firstName: "Bryson", lastName: "DeChambeau" },
      { firstName: "Scottie", lastName: "Scheffler" },
      { firstName: "Ludvig", lastName: "Aberg" },
      { firstName: "Viktor", lastName: "Hovland" },
      { firstName: "Akshay", lastName: "Bhatia" },
      { firstName: "Robert", lastName: "MacIntyre" },
    ],
  },
  {
    name: "Corell, Sarah",
    // Alternate (use if a pick WDs): Sungjae Im
    picks: [
      { firstName: "Jon", lastName: "Rahm" },
      { firstName: "Bryson", lastName: "DeChambeau" },
      { firstName: "Hideki", lastName: "Matsuyama" },
      { firstName: "Justin", lastName: "Thomas" },
      { firstName: "Shane", lastName: "Lowry" },
      { firstName: "J.J.", lastName: "Spaun" },
    ],
  },
  {
    name: "Davis, Luke",
    // Alternate (use if a pick WDs): Akshay Bhatia
    picks: [
      { firstName: "Rory", lastName: "McIlroy" },
      { firstName: "Jon", lastName: "Rahm" },
      { firstName: "Hideki", lastName: "Matsuyama" },
      { firstName: "Ludvig", lastName: "Aberg" },
      { firstName: "Patrick", lastName: "Reed" },
      { firstName: "Jake", lastName: "Knapp" },
    ],
  },
  {
    name: "Faidley, Jamie",
    // Alternate (use if a pick WDs): Patrick Reed
    picks: [
      { firstName: "Scottie", lastName: "Scheffler" },
      { firstName: "Jon", lastName: "Rahm" },
      { firstName: "Ludvig", lastName: "Aberg" },
      { firstName: "Hideki", lastName: "Matsuyama" },
      { firstName: "Robert", lastName: "MacIntyre" },
      { firstName: "Min Woo", lastName: "Lee" },
    ],
  },
  {
    name: "Grimm, Kevin",
    // Alternate (use if a pick WDs): Min Woo Lee
    picks: [
      { firstName: "Cameron", lastName: "Young" },
      { firstName: "Bryson", lastName: "DeChambeau" },
      { firstName: "Ludvig", lastName: "Aberg" },
      { firstName: "Robert", lastName: "MacIntyre" },
      { firstName: "Patrick", lastName: "Reed" },
      { firstName: "Akshay", lastName: "Bhatia" },
    ],
  },
  {
    name: "Hancock, Shawn",
    // Alternate (use if a pick WDs): Shane Lowry
    picks: [
      { firstName: "Cameron", lastName: "Young" },
      { firstName: "Bryson", lastName: "DeChambeau" },
      { firstName: "Robert", lastName: "MacIntyre" },
      { firstName: "Patrick", lastName: "Reed" },
      { firstName: "Hideki", lastName: "Matsuyama" },
      { firstName: "Jordan", lastName: "Spieth" },
    ],
  },
  {
    name: "Hartlieb, Chuck #1",
    // Alternate (use if a pick WDs): Dustin Johnson
    picks: [
      { firstName: "Cameron", lastName: "Young" },
      { firstName: "Matt", lastName: "Fitzpatrick" },
      { firstName: "Ludvig", lastName: "Aberg" },
      { firstName: "J.J.", lastName: "Spaun" },
      { firstName: "Hideki", lastName: "Matsuyama" },
      { firstName: "Patrick", lastName: "Reed" },
    ],
  },
  {
    name: "Hartlieb, Chuck #2",
    // Alternate (use if a pick WDs): Dustin Johnson
    picks: [
      { firstName: "Jon", lastName: "Rahm" },
      { firstName: "Bryson", lastName: "DeChambeau" },
      { firstName: "Ludvig", lastName: "Aberg" },
      { firstName: "Akshay", lastName: "Bhatia" },
      { firstName: "Viktor", lastName: "Hovland" },
      { firstName: "Patrick", lastName: "Reed" },
    ],
  },
  {
    name: "Hartlieb, Dan #1",
    // Alternate (use if a pick WDs): Dustin Johnson
    picks: [
      { firstName: "Scottie", lastName: "Scheffler" },
      { firstName: "Jon", lastName: "Rahm" },
      { firstName: "J.J.", lastName: "Spaun" },
      { firstName: "Adam", lastName: "Scott" },
      { firstName: "Ludvig", lastName: "Aberg" },
      { firstName: "Harris", lastName: "English" },
    ],
  },
  {
    name: "Hartlieb, Dan #2",
    // Alternate (use if a pick WDs): Dustin Johnson
    picks: [
      { firstName: "Cameron", lastName: "Young" },
      { firstName: "Xander", lastName: "Schauffele" },
      { firstName: "Jordan", lastName: "Spieth" },
      { firstName: "Patrick", lastName: "Reed" },
      { firstName: "Akshay", lastName: "Bhatia" },
      { firstName: "Jacob", lastName: "Bridgeman" },
    ],
  },
  {
    name: "Hartlieb, Lou",
    // Alternate (use if a pick WDs): Min Woo Lee
    picks: [
      { firstName: "Scottie", lastName: "Scheffler" },
      { firstName: "Xander", lastName: "Schauffele" },
      { firstName: "Ludvig", lastName: "Aberg" },
      { firstName: "Patrick", lastName: "Reed" },
      { firstName: "Hideki", lastName: "Matsuyama" },
      { firstName: "Sepp", lastName: "Straka" },
    ],
  },
  {
    name: "Haynes, Chris",
    // Alternate (use if a pick WDs): Sepp Straka
    picks: [
      { firstName: "Matt", lastName: "Fitzpatrick" },
      { firstName: "Jon", lastName: "Rahm" },
      { firstName: "Ludvig", lastName: "Aberg" },
      { firstName: "Min Woo", lastName: "Lee" },
      { firstName: "Jordan", lastName: "Spieth" },
      { firstName: "Si Woo", lastName: "Kim" },
    ],
  },
  {
    name: "Haynes, Zach",
    // Alternate (use if a pick WDs): Ben Griffin
    picks: [
      { firstName: "Scottie", lastName: "Scheffler" },
      { firstName: "Tommy", lastName: "Fleetwood" },
      { firstName: "Robert", lastName: "MacIntyre" },
      { firstName: "Akshay", lastName: "Bhatia" },
      { firstName: "J.J.", lastName: "Spaun" },
      { firstName: "Hideki", lastName: "Matsuyama" },
    ],
  },
  {
    name: "Herrera, Ben",
    // Alternate (use if a pick WDs): Akshay Bhatia
    picks: [
      { firstName: "Scottie", lastName: "Scheffler" },
      { firstName: "Jon", lastName: "Rahm" },
      { firstName: "J.J.", lastName: "Spaun" },
      { firstName: "Ludvig", lastName: "Aberg" },
      { firstName: "Robert", lastName: "MacIntyre" },
      { firstName: "Hideki", lastName: "Matsuyama" },
    ],
  },
  {
    name: "Hurley, John",
    // Alternate (use if a pick WDs): Shane Lowry
    picks: [
      { firstName: "Scottie", lastName: "Scheffler" },
      { firstName: "Rory", lastName: "McIlroy" },
      { firstName: "Ludvig", lastName: "Aberg" },
      { firstName: "Brooks", lastName: "Koepka" },
      { firstName: "Hideki", lastName: "Matsuyama" },
      { firstName: "Viktor", lastName: "Hovland" },
    ],
  },
  {
    name: "Jackson, Joel #1",
    // Alternate (use if a pick WDs): Sepp Straka
    picks: [
      { firstName: "Matt", lastName: "Fitzpatrick" },
      { firstName: "Tommy", lastName: "Fleetwood" },
      { firstName: "Ludvig", lastName: "Aberg" },
      { firstName: "Patrick", lastName: "Reed" },
      { firstName: "Akshay", lastName: "Bhatia" },
      { firstName: "Robert", lastName: "MacIntyre" },
    ],
  },
  {
    name: "Jackson, Joel #2",
    // Alternate (use if a pick WDs): Sam Burns
    picks: [
      { firstName: "Xander", lastName: "Schauffele" },
      { firstName: "Jon", lastName: "Rahm" },
      { firstName: "Ludvig", lastName: "Aberg" },
      { firstName: "Ben", lastName: "Griffin" },
      { firstName: "Justin", lastName: "Thomas" },
      { firstName: "Jacob", lastName: "Bridgeman" },
    ],
  },
  {
    name: "Jackson, Trey",
    // Alternate (use if a pick WDs): Patrick Reed
    picks: [
      { firstName: "Scottie", lastName: "Scheffler" },
      { firstName: "Cameron", lastName: "Young" },
      { firstName: "Ludvig", lastName: "Aberg" },
      { firstName: "Robert", lastName: "MacIntyre" },
      { firstName: "Hideki", lastName: "Matsuyama" },
      { firstName: "Tyrrell", lastName: "Hatton" },
    ],
  },
  {
    name: "Johnson, Ron",
    // Alternate (use if a pick WDs): Jake Knapp
    picks: [
      { firstName: "Jon", lastName: "Rahm" },
      { firstName: "Rory", lastName: "McIlroy" },
      { firstName: "Hideki", lastName: "Matsuyama" },
      { firstName: "Viktor", lastName: "Hovland" },
      { firstName: "Patrick", lastName: "Reed" },
      { firstName: "Robert", lastName: "MacIntyre" },
    ],
  },
  {
    name: "Johnson, Tom",
    // Alternate (use if a pick WDs): Brooks Koepka
    picks: [
      { firstName: "Scottie", lastName: "Scheffler" },
      { firstName: "Jon", lastName: "Rahm" },
      { firstName: "Ludvig", lastName: "Aberg" },
      { firstName: "Hideki", lastName: "Matsuyama" },
      { firstName: "Min Woo", lastName: "Lee" },
      { firstName: "Robert", lastName: "MacIntyre" },
    ],
  },
  {
    name: "LeMense, Zach",
    // Alternate (use if a pick WDs): Patrick Reed
    picks: [
      { firstName: "Scottie", lastName: "Scheffler" },
      { firstName: "Matt", lastName: "Fitzpatrick" },
      { firstName: "Ludvig", lastName: "Aberg" },
      { firstName: "Hideki", lastName: "Matsuyama" },
      { firstName: "Akshay", lastName: "Bhatia" },
      { firstName: "Jordan", lastName: "Spieth" },
    ],
  },
  {
    name: "LeWarne, Steve (Papa 1)",
    // Alternate (use if a pick WDs): Jordan Spieth
    picks: [
      { firstName: "Scottie", lastName: "Scheffler" },
      { firstName: "Bryson", lastName: "DeChambeau" },
      { firstName: "Hideki", lastName: "Matsuyama" },
      { firstName: "Patrick", lastName: "Reed" },
      { firstName: "Ludvig", lastName: "Aberg" },
      { firstName: "Robert", lastName: "MacIntyre" },
    ],
  },
  {
    name: "LeWarne, Steve (Papa 2)",
    // Alternate (use if a pick WDs): Sam Burns
    picks: [
      { firstName: "Jon", lastName: "Rahm" },
      { firstName: "Xander", lastName: "Schauffele" },
      { firstName: "Min Woo", lastName: "Lee" },
      { firstName: "Ludvig", lastName: "Aberg" },
      { firstName: "Patrick", lastName: "Reed" },
      { firstName: "Corey", lastName: "Conners" },
    ],
  },
  {
    name: "McCarty, Anna",
    // Alternate (use if a pick WDs): Brooks Koepka
    picks: [
      { firstName: "Bryson", lastName: "DeChambeau" },
      { firstName: "Jon", lastName: "Rahm" },
      { firstName: "Ludvig", lastName: "Aberg" },
      { firstName: "Jacob", lastName: "Bridgeman" },
      { firstName: "Patrick", lastName: "Reed" },
      { firstName: "Hideki", lastName: "Matsuyama" },
    ],
  },
  {
    name: "McCarty, Joe",
    // Alternate (use if a pick WDs): Matthew McCarty
    picks: [
      { firstName: "Scottie", lastName: "Scheffler" },
      { firstName: "Rory", lastName: "McIlroy" },
      { firstName: "Ludvig", lastName: "Aberg" },
      { firstName: "Patrick", lastName: "Reed" },
      { firstName: "Nicolai", lastName: "Hojgaard" },
      { firstName: "Robert", lastName: "MacIntyre" },
    ],
  },
  {
    name: "McCarty, Marissa",
    // Alternate (use if a pick WDs): Si Woo Kim
    picks: [
      { firstName: "Scottie", lastName: "Scheffler" },
      { firstName: "Jon", lastName: "Rahm" },
      { firstName: "Patrick", lastName: "Reed" },
      { firstName: "Hideki", lastName: "Matsuyama" },
      { firstName: "Jordan", lastName: "Spieth" },
      { firstName: "Min Woo", lastName: "Lee" },
    ],
  },
  {
    name: "Mott, Kyle",
    // Alternate (use if a pick WDs): Aldrich Potgieter
    picks: [
      { firstName: "Justin", lastName: "Rose" },
      { firstName: "Xander", lastName: "Schauffele" },
      { firstName: "Brooks", lastName: "Koepka" },
      { firstName: "Sepp", lastName: "Straka" },
      { firstName: "Hideki", lastName: "Matsuyama" },
      { firstName: "Robert", lastName: "MacIntyre" },
    ],
  },
  {
    name: "Moulton, Cade",
    // Alternate (use if a pick WDs): Min Woo Lee
    picks: [
      { firstName: "Cameron", lastName: "Young" },
      { firstName: "Tommy", lastName: "Fleetwood" },
      { firstName: "Ben", lastName: "Griffin" },
      { firstName: "Hideki", lastName: "Matsuyama" },
      { firstName: "Nick", lastName: "Taylor" },
      { firstName: "Cameron", lastName: "Smith" },
    ],
  },
  {
    name: "Mueller, Dustin",
    // Alternate (use if a pick WDs): Robert MacIntyre
    picks: [
      { firstName: "Jon", lastName: "Rahm" },
      { firstName: "Scottie", lastName: "Scheffler" },
      { firstName: "Brooks", lastName: "Koepka" },
      { firstName: "Ludvig", lastName: "Aberg" },
      { firstName: "Nicolai", lastName: "Hojgaard" },
      { firstName: "Min Woo", lastName: "Lee" },
    ],
  },
  {
    name: "Nelson, Joel",
    // Alternate (use if a pick WDs): Akshay Bhatia
    picks: [
      { firstName: "Jon", lastName: "Rahm" },
      { firstName: "Matt", lastName: "Fitzpatrick" },
      { firstName: "Ludvig", lastName: "Aberg" },
      { firstName: "Hideki", lastName: "Matsuyama" },
      { firstName: "Sepp", lastName: "Straka" },
      { firstName: "Justin", lastName: "Thomas" },
    ],
  },
  {
    name: "O'Hare, Jim",
    // Alternate (use if a pick WDs): Maverick McNealy
    picks: [
      { firstName: "Scottie", lastName: "Scheffler" },
      { firstName: "Tommy", lastName: "Fleetwood" },
      { firstName: "Ludvig", lastName: "Aberg" },
      { firstName: "Jacob", lastName: "Bridgeman" },
      { firstName: "J.J.", lastName: "Spaun" },
      { firstName: "Robert", lastName: "MacIntyre" },
    ],
  },
  {
    name: "O'Hare, Kevin #1",
    // Alternate (use if a pick WDs): Si Woo Kim
    picks: [
      { firstName: "Scottie", lastName: "Scheffler" },
      { firstName: "Bryson", lastName: "DeChambeau" },
      { firstName: "Ludvig", lastName: "Aberg" },
      { firstName: "Shane", lastName: "Lowry" },
      { firstName: "Patrick", lastName: "Reed" },
      { firstName: "Min Woo", lastName: "Lee" },
    ],
  },
  {
    name: "O'Hare, Kevin #2",
    // Alternate (use if a pick WDs): Justin Thomas
    picks: [
      { firstName: "Rory", lastName: "McIlroy" },
      { firstName: "Jon", lastName: "Rahm" },
      { firstName: "Hideki", lastName: "Matsuyama" },
      { firstName: "Patrick", lastName: "Cantlay" },
      { firstName: "Jordan", lastName: "Spieth" },
      { firstName: "Brooks", lastName: "Koepka" },
    ],
  },
  {
    name: "O'Hare, Ryan",
    // Alternate (use if a pick WDs): Max Homa
    picks: [
      { firstName: "Scottie", lastName: "Scheffler" },
      { firstName: "Bryson", lastName: "DeChambeau" },
      { firstName: "Ludvig", lastName: "Aberg" },
      { firstName: "Si Woo", lastName: "Kim" },
      { firstName: "Viktor", lastName: "Hovland" },
      { firstName: "Tyrrell", lastName: "Hatton" },
    ],
  },
  {
    name: "O'Hare, Sean",
    // Alternate (use if a pick WDs): Cameron Smith
    picks: [
      { firstName: "Matt", lastName: "Fitzpatrick" },
      { firstName: "Collin", lastName: "Morikawa" },
      { firstName: "Sam", lastName: "Burns" },
      { firstName: "Jason", lastName: "Day" },
      { firstName: "Justin", lastName: "Thomas" },
      { firstName: "Sungjae", lastName: "Im" },
    ],
  },
  {
    name: "Pearce, Brandon",
    // Alternate (use if a pick WDs): Jason Day
    picks: [
      { firstName: "Jon", lastName: "Rahm" },
      { firstName: "Rory", lastName: "McIlroy" },
      { firstName: "Hideki", lastName: "Matsuyama" },
      { firstName: "Tyrrell", lastName: "Hatton" },
      { firstName: "Viktor", lastName: "Hovland" },
      { firstName: "Sepp", lastName: "Straka" },
    ],
  },
  {
    name: "Pearson, Jay",
    // Alternate (use if a pick WDs): Viktor Hovland
    picks: [
      { firstName: "Scottie", lastName: "Scheffler" },
      { firstName: "Rory", lastName: "McIlroy" },
      { firstName: "Ludvig", lastName: "Aberg" },
      { firstName: "Sepp", lastName: "Straka" },
      { firstName: "Robert", lastName: "MacIntyre" },
      { firstName: "Patrick", lastName: "Reed" },
    ],
  },
  {
    name: "Pearson, Joel",
    // Alternate (use if a pick WDs): Akshay Bhatia
    picks: [
      { firstName: "Xander", lastName: "Schauffele" },
      { firstName: "Justin", lastName: "Rose" },
      { firstName: "Ludvig", lastName: "Aberg" },
      { firstName: "Hideki", lastName: "Matsuyama" },
      { firstName: "Robert", lastName: "MacIntyre" },
      { firstName: "Nicolai", lastName: "Hojgaard" },
    ],
  },
  {
    name: "Pearson, Jonathon",
    // Alternate (use if a pick WDs): Adam Scott
    picks: [
      { firstName: "Scottie", lastName: "Scheffler" },
      { firstName: "Xander", lastName: "Schauffele" },
      { firstName: "Ludvig", lastName: "Aberg" },
      { firstName: "Justin", lastName: "Thomas" },
      { firstName: "Jordan", lastName: "Spieth" },
      { firstName: "Viktor", lastName: "Hovland" },
    ],
  },
  {
    name: "Pearson, Spencer",
    // Alternate (use if a pick WDs): Adam Scott
    picks: [
      { firstName: "Xander", lastName: "Schauffele" },
      { firstName: "Matt", lastName: "Fitzpatrick" },
      { firstName: "Ludvig", lastName: "Aberg" },
      { firstName: "Brooks", lastName: "Koepka" },
      { firstName: "Jordan", lastName: "Spieth" },
      { firstName: "Jake", lastName: "Knapp" },
    ],
  },
  {
    name: "Plummer, Craig",
    // Alternate (use if a pick WDs): J.J. Spaun
    picks: [
      { firstName: "Scottie", lastName: "Scheffler" },
      { firstName: "Cameron", lastName: "Young" },
      { firstName: "Min Woo", lastName: "Lee" },
      { firstName: "Hideki", lastName: "Matsuyama" },
      { firstName: "Ludvig", lastName: "Aberg" },
      { firstName: "Robert", lastName: "MacIntyre" },
    ],
  },
  {
    name: "Price, Grant",
    // Alternate (use if a pick WDs): Jake Knapp
    picks: [
      { firstName: "Jon", lastName: "Rahm" },
      { firstName: "Xander", lastName: "Schauffele" },
      { firstName: "Ludvig", lastName: "Aberg" },
      { firstName: "Patrick", lastName: "Reed" },
      { firstName: "Hideki", lastName: "Matsuyama" },
      { firstName: "Akshay", lastName: "Bhatia" },
    ],
  },
  {
    name: "Price, Joe",
    // Alternate (use if a pick WDs): Brooks Koepka
    picks: [
      { firstName: "Xander", lastName: "Schauffele" },
      { firstName: "Bryson", lastName: "DeChambeau" },
      { firstName: "Patrick", lastName: "Reed" },
      { firstName: "Robert", lastName: "MacIntyre" },
      { firstName: "Ludvig", lastName: "Aberg" },
      { firstName: "Akshay", lastName: "Bhatia" },
    ],
  },
  {
    name: "Pyle, Mike",
    // Alternate (use if a pick WDs): Adam Scott
    picks: [
      { firstName: "Scottie", lastName: "Scheffler" },
      { firstName: "Jon", lastName: "Rahm" },
      { firstName: "Hideki", lastName: "Matsuyama" },
      { firstName: "Ludvig", lastName: "Aberg" },
      { firstName: "Patrick", lastName: "Reed" },
      { firstName: "J.J.", lastName: "Spaun" },
    ],
  },
  {
    name: "Rice, Josh",
    // Alternate (use if a pick WDs): Tyrrell Hatton
    picks: [
      { firstName: "Scottie", lastName: "Scheffler" },
      { firstName: "Matt", lastName: "Fitzpatrick" },
      { firstName: "Min Woo", lastName: "Lee" },
      { firstName: "Ludvig", lastName: "Aberg" },
      { firstName: "Viktor", lastName: "Hovland" },
      { firstName: "Si Woo", lastName: "Kim" },
    ],
  },
  {
    name: "Richter, Pat",
    // Alternate (use if a pick WDs): Shane Lowry
    picks: [
      { firstName: "Chris", lastName: "Gotterup" },
      { firstName: "Cameron", lastName: "Young" },
      { firstName: "Sungjae", lastName: "Im" },
      { firstName: "Ludvig", lastName: "Aberg" },
      { firstName: "Robert", lastName: "MacIntyre" },
      { firstName: "Brian", lastName: "Harman" },
    ],
  },
  {
    name: "Riggs, Ryan",
    // Alternate (use if a pick WDs): Ludvig Aberg
    picks: [
      { firstName: "Bryson", lastName: "DeChambeau" },
      { firstName: "Jon", lastName: "Rahm" },
      { firstName: "Sungjae", lastName: "Im" },
      { firstName: "Akshay", lastName: "Bhatia" },
      { firstName: "Patrick", lastName: "Reed" },
      { firstName: "Robert", lastName: "MacIntyre" },
    ],
  },
  {
    name: "Rizk, Bill",
    // Alternate (use if a pick WDs): Tyrrell Hatton
    picks: [
      { firstName: "Matt", lastName: "Fitzpatrick" },
      { firstName: "Xander", lastName: "Schauffele" },
      { firstName: "Jordan", lastName: "Spieth" },
      { firstName: "Hideki", lastName: "Matsuyama" },
      { firstName: "Viktor", lastName: "Hovland" },
      { firstName: "Ludvig", lastName: "Aberg" },
    ],
  },
  {
    name: "Schneebeck, James",
    // Alternate (use if a pick WDs): Jordan Spieth
    picks: [
      { firstName: "Jon", lastName: "Rahm" },
      { firstName: "Scottie", lastName: "Scheffler" },
      { firstName: "Ludvig", lastName: "Aberg" },
      { firstName: "Brooks", lastName: "Koepka" },
      { firstName: "Patrick", lastName: "Reed" },
      { firstName: "Akshay", lastName: "Bhatia" },
    ],
  },
  {
    name: "Shindler, Aaron",
    // Alternate (use if a pick WDs): Shane Lowry
    picks: [
      { firstName: "Tommy", lastName: "Fleetwood" },
      { firstName: "Xander", lastName: "Schauffele" },
      { firstName: "Ludvig", lastName: "Aberg" },
      { firstName: "Hideki", lastName: "Matsuyama" },
      { firstName: "Akshay", lastName: "Bhatia" },
      { firstName: "Viktor", lastName: "Hovland" },
    ],
  },
  {
    name: "Simplot, Tim",
    // Alternate (use if a pick WDs): Patrick Reed
    picks: [
      { firstName: "Scottie", lastName: "Scheffler" },
      { firstName: "Tommy", lastName: "Fleetwood" },
      { firstName: "Ludvig", lastName: "Aberg" },
      { firstName: "Brooks", lastName: "Koepka" },
      { firstName: "Jordan", lastName: "Spieth" },
      { firstName: "Justin", lastName: "Thomas" },
    ],
  },
  {
    name: "Smith, Josh",
    // Alternate (use if a pick WDs): Hideki Matsuyama
    picks: [
      { firstName: "Scottie", lastName: "Scheffler" },
      { firstName: "Rory", lastName: "McIlroy" },
      { firstName: "Ludvig", lastName: "Aberg" },
      { firstName: "Akshay", lastName: "Bhatia" },
      { firstName: "Viktor", lastName: "Hovland" },
      { firstName: "Justin", lastName: "Thomas" },
    ],
  },
  {
    name: "Snakenberg, Cade",
    // Alternate (use if a pick WDs): Viktor Hovland
    picks: [
      { firstName: "Xander", lastName: "Schauffele" },
      { firstName: "Justin", lastName: "Rose" },
      { firstName: "Ludvig", lastName: "Aberg" },
      { firstName: "Sam", lastName: "Burns" },
      { firstName: "Akshay", lastName: "Bhatia" },
      { firstName: "Hideki", lastName: "Matsuyama" },
    ],
  },
  {
    name: "Stewart, Mitch",
    // Alternate (use if a pick WDs): Akshay Bhatia
    picks: [
      { firstName: "Scottie", lastName: "Scheffler" },
      { firstName: "Jon", lastName: "Rahm" },
      { firstName: "Ludvig", lastName: "Aberg" },
      { firstName: "Patrick", lastName: "Reed" },
      { firstName: "Corey", lastName: "Conners" },
      { firstName: "Hideki", lastName: "Matsuyama" },
    ],
  },
  {
    name: "Varcoe, Nick",
    // Alternate (use if a pick WDs): Harris English
    picks: [
      { firstName: "Xander", lastName: "Schauffele" },
      { firstName: "Scottie", lastName: "Scheffler" },
      { firstName: "Min Woo", lastName: "Lee" },
      { firstName: "Ludvig", lastName: "Aberg" },
      { firstName: "Si Woo", lastName: "Kim" },
      { firstName: "Patrick", lastName: "Reed" },
    ],
  },
  {
    name: "Vinyard, Tim",
    // Alternate (use if a pick WDs): Brooks Koepka
    picks: [
      { firstName: "Scottie", lastName: "Scheffler" },
      { firstName: "Rory", lastName: "McIlroy" },
      { firstName: "Ludvig", lastName: "Aberg" },
      { firstName: "Hideki", lastName: "Matsuyama" },
      { firstName: "Robert", lastName: "MacIntyre" },
      { firstName: "Patrick", lastName: "Reed" },
    ],
  },
  {
    name: "Vogel, Rod #1",
    // Alternate (use if a pick WDs): Viktor Hovland
    picks: [
      { firstName: "Scottie", lastName: "Scheffler" },
      { firstName: "Jon", lastName: "Rahm" },
      { firstName: "Robert", lastName: "MacIntyre" },
      { firstName: "Ludvig", lastName: "Aberg" },
      { firstName: "Corey", lastName: "Conners" },
      { firstName: "Min Woo", lastName: "Lee" },
    ],
  },
  {
    name: "Vogel, Rod #2",
    // Alternate (use if a pick WDs): Tyrrell Hatton
    picks: [
      { firstName: "Rory", lastName: "McIlroy" },
      { firstName: "Bryson", lastName: "DeChambeau" },
      { firstName: "Patrick", lastName: "Reed" },
      { firstName: "Akshay", lastName: "Bhatia" },
      { firstName: "Brooks", lastName: "Koepka" },
      { firstName: "Hideki", lastName: "Matsuyama" },
    ],
  },
  {
    name: "Wegman, Billy",
    // Alternate (use if a pick WDs): Jason Day
    picks: [
      { firstName: "Rory", lastName: "McIlroy" },
      { firstName: "Bryson", lastName: "DeChambeau" },
      { firstName: "Ludvig", lastName: "Aberg" },
      { firstName: "Adam", lastName: "Scott" },
      { firstName: "Patrick", lastName: "Reed" },
      { firstName: "Nicolai", lastName: "Hojgaard" },
    ],
  },
  {
    name: "Wegman, Brett",
    // Alternate (use if a pick WDs): Max Homa
    picks: [
      { firstName: "Collin", lastName: "Morikawa" },
      { firstName: "Bryson", lastName: "DeChambeau" },
      { firstName: "Ludvig", lastName: "Aberg" },
      { firstName: "Hideki", lastName: "Matsuyama" },
      { firstName: "Min Woo", lastName: "Lee" },
      { firstName: "Sungjae", lastName: "Im" },
    ],
  },
  {
    name: "Wegman, Jay",
    // Alternate (use if a pick WDs): Min Woo Lee
    picks: [
      { firstName: "Jon", lastName: "Rahm" },
      { firstName: "Cameron", lastName: "Young" },
      { firstName: "Sepp", lastName: "Straka" },
      { firstName: "Si Woo", lastName: "Kim" },
      { firstName: "Viktor", lastName: "Hovland" },
      { firstName: "Jordan", lastName: "Spieth" },
    ],
  },
  {
    name: "Wegman, Joey",
    // Alternate (use if a pick WDs): Jordan Spieth
    picks: [
      { firstName: "Scottie", lastName: "Scheffler" },
      { firstName: "Tommy", lastName: "Fleetwood" },
      { firstName: "Ludvig", lastName: "Aberg" },
      { firstName: "Patrick", lastName: "Cantlay" },
      { firstName: "Hideki", lastName: "Matsuyama" },
      { firstName: "Justin", lastName: "Thomas" },
    ],
  },
  {
    name: "Wegman, Nick",
    // Alternate (use if a pick WDs): Nicolai Hojgaard
    picks: [
      { firstName: "Xander", lastName: "Schauffele" },
      { firstName: "Rory", lastName: "McIlroy" },
      { firstName: "Jake", lastName: "Knapp" },
      { firstName: "Maverick", lastName: "McNealy" },
      { firstName: "Jordan", lastName: "Spieth" },
      { firstName: "Si Woo", lastName: "Kim" },
    ],
  },
  {
    name: "Wegman, Stacy",
    // Alternate (use if a pick WDs): Jacob Bridgeman
    picks: [
      { firstName: "Matt", lastName: "Fitzpatrick" },
      { firstName: "Jon", lastName: "Rahm" },
      { firstName: "Ludvig", lastName: "Aberg" },
      { firstName: "Hideki", lastName: "Matsuyama" },
      { firstName: "Patrick", lastName: "Reed" },
      { firstName: "Min Woo", lastName: "Lee" },
    ],
  },
  {
    name: "Wegman, Tim",
    // Alternate (use if a pick WDs): Jacob Bridgeman
    picks: [
      { firstName: "Scottie", lastName: "Scheffler" },
      { firstName: "Tommy", lastName: "Fleetwood" },
      { firstName: "Robert", lastName: "MacIntyre" },
      { firstName: "Tyrrell", lastName: "Hatton" },
      { firstName: "Patrick", lastName: "Cantlay" },
      { firstName: "Rasmus", lastName: "Hojgaard" },
    ],
  },
  {
    name: "Weresh, Matt",
    // Alternate (use if a pick WDs): Gary Woodland
    picks: [
      { firstName: "Cameron", lastName: "Young" },
      { firstName: "Bryson", lastName: "DeChambeau" },
      { firstName: "Ludvig", lastName: "Aberg" },
      { firstName: "Harris", lastName: "English" },
      { firstName: "Robert", lastName: "MacIntyre" },
      { firstName: "Hideki", lastName: "Matsuyama" },
    ],
  },
  {
    name: "Weresh, Melissa",
    // Alternate (use if a pick WDs): Min Woo Lee
    picks: [
      { firstName: "Scottie", lastName: "Scheffler" },
      { firstName: "Matt", lastName: "Fitzpatrick" },
      { firstName: "Ludvig", lastName: "Aberg" },
      { firstName: "Gary", lastName: "Woodland" },
      { firstName: "Sam", lastName: "Burns" },
      { firstName: "Justin", lastName: "Thomas" },
    ],
  }
];

// ----------------------------------------------------
// SCORING RULES
// Each day we award the participant whose 2-of-6 golfers
// have the LOWEST combined score for that specific day.
// "Best 2" means the two lowest individual daily scores.
// ----------------------------------------------------
const SCORING_CONFIG = {
  dailyPicksScored: 2,       // Number of best daily scores to add together
  totalPicksPerPerson: 6,    // Total picks each person has
};

// ----------------------------------------------------
// COURSE PAR — used to convert raw round stroke totals
// into relative-to-par scores for completed rounds.
// Augusta National is par 72.
// ----------------------------------------------------
const COURSE_PAR = 72;

// ----------------------------------------------------
// API CONFIG (can also be set in Settings modal at runtime)
// ----------------------------------------------------
const DEFAULT_API_CONFIG = {
  tournId: "014",     // Masters is typically 014 — verify via /schedule
  year: "2025",
  orgId: "1",         // 1 = PGA Tour
};
