import ShortUniqueId from "short-unique-id";
import fse from "fs-extra/esm";
import * as url from "node:url";
import { join } from "node:path";
import { randomItemFromArray, dateAdd } from "./utils.js";

const __dirname = url.fileURLToPath( new URL( ".", import.meta.url ) );

function generateRandomNames( numOfNames ) {
  const firstNames = [ "Marty", "Joe", "Lacey", "Woody", "Fluffy", "Red", "John", "Susan", "Layla", "Clint", "Feathers", "Sharon", "Sheila" ];
  const lastNames = [ "Webber", "Woody", "St Dive", "Quack", "Flapper", "McQuack", "McFly", "Pintail", "Beak", "Nest", "Wing", "Wood", "Mallard", "Feathers", "Fowler", "Waddle", "Duck", "Duckling", "Swimmer" ];
  const females = [ "Lacey", "Fluffy", "Susan", "Layla", "Sharon", "Sheila" ];
  const names = [
    { firstName: "Marty", lastName: "McFly", gender: "male" },
    { firstName: "Duckota", lastName: "Fanning", gender: "female" },
    { firstName: "Duck", lastName: "Norris", gender: "male" },
    { firstName: "James", lastName: "Pond", gender: "male" },
    { firstName: "Darth", lastName: "Wader", gender: "male" },
    { firstName: "Clint", lastName: "Beakwood", gender: "male" },
    { firstName: "Mary", lastName: "Quackens", gender: "female" },
    { firstName: "Ducky", lastName: "Balboa", gender: "male" },
    { firstName: "Captain", lastName: "Quack", gender: "male" },
    { firstName: "Wonder", lastName: "Duck", gender: "female" },
    { firstName: "Wing", lastName: "Smith", gender: "male" },
    { firstName: "Johnny", lastName: "Duck", gender: "male" },
    { firstName: "Gene", lastName: "Duckman", gender: "male" },
    { firstName: "Honk", lastName: "Williams", gender: "male" },
    { firstName: "Tom", lastName: "Honks", gender: "male" },
    { firstName: "Ducky", lastName: "Parton", gender: "female" }
  ];

  for( let i = 0; i < numOfNames; i++ ) {
    let newName;
    let firstName;
    let lastName;
    let gender;
    do {
      firstName = randomItemFromArray( firstNames );
      lastName = randomItemFromArray( lastNames );
      gender = females.includes( firstName ) ? "female" : "male";
      newName = { firstName, lastName, gender };
    } while ( firstName === lastName || names.includes( newName ) );

    names.push( newName );
  }
  return names;
}

async function generateDucks() {
  const numberOfDucks = 50;
  const colors = [ "green", "brown", "yellow", "teal", "red", "orange" ];

  console.log( "generating ducks..." );
  // const names = shuffle( generateRandomNames( numberOfDucks ) );
  const names = generateRandomNames( numberOfDucks );

  const ducks = [];
  const uid = new ShortUniqueId();
  for( let i = 0; i < numberOfDucks; i++ ) {
    const id = uid.rnd();
    const color = randomItemFromArray( colors );
    const { firstName, lastName, gender } = names[i];
    ducks.push( {
      id,
      color,
      firstName,
      lastName,
      gender
    } );
  }

  console.log( "saving ducks..." );
  await fse.writeJson( join( __dirname, "ducks.json" ), ducks, { spaces: 2 } );
  return ducks;
}

async function generateSamples( ducks ) {
  const actions = [
    { action: "eating", weight: 25 },
    { action: "annoying", weight: 25 },
    { action: "quacking", weight: 25 },
    { action: "swimming", weight: 15 },
    { action: "waddling", weight: 15 },
    { action: "flying", weight: 5 },
    { action: "sleeping", weight: 40 },
    { action: "sunbathing", weight: 15 },
    { action: "diving", weight: 5 },
    { action: "dancing", weight: 5 },
    { action: "twitching", weight: 5 },
    { action: "posting on social media", weight: 2 }
  ];

  const allActions = [];
  actions.forEach( action => {
    for( let i = 0; i < action.weight; i++ ) {
      allActions.push( action.action );
    }
  } );

  console.log( "generating activity samples..." );
  const samples = [];
  const minutesBetweenSamples = 10;
  const numberOfSamplesPerDay = ( 60 * 24 ) / minutesBetweenSamples;
  const numberOfDays = 30;
  const startDate = new Date( Date.UTC( 2024, 0 ) );
  for ( let day = 0; day < numberOfDays; day++ ) {
    const thisDate = dateAdd( startDate, "day", day );
    for( let i = 0; i < numberOfSamplesPerDay; i++ ) {
      const sampleTime = dateAdd( thisDate, "minute", i * minutesBetweenSamples );
      for( let j = 0; j < ducks.length; j++ ) {
        const duck = ducks[j];
        const action = randomItemFromArray( allActions );
        samples.push( {
          id: duck.id,
          sampleTime,
          action
        } );
      }
    }
  }

  console.log( "saving sample logs..." );
  await fse.writeJson( join( __dirname, "samples.json" ), samples, { spaces: 2 } );
}

async function main() {
  const ducks = await generateDucks();
  await generateSamples( ducks );
}

await main();
console.log( "finished" );

