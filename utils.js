export function randomItemFromArray( arr ) {
  return arr[( Math.floor( Math.random() * arr.length ) )];
}

export function shuffle( array ) {
  let currentIndex = array.length,  randomIndex;
  while ( currentIndex > 0 ) {
    randomIndex = Math.floor( Math.random() * currentIndex );
    currentIndex--;
    [ array[currentIndex], array[randomIndex] ] = [
      array[randomIndex], array[currentIndex] ];
  }
  return array;
}

export function dateAdd( date, interval, units ) {
  if( !( date instanceof Date ) )
    return undefined;
  let ret = new Date( date ); //don't change original date
  let checkRollover = function() { if( ret.getDate() != date.getDate() ) ret.setDate( 0 );};
  switch( String( interval ).toLowerCase() ) {
  case "year"   :  ret.setFullYear( ret.getFullYear() + units ); checkRollover();  break;
  case "quarter":  ret.setMonth( ret.getMonth() + 3*units ); checkRollover();  break;
  case "month"  :  ret.setMonth( ret.getMonth() + units ); checkRollover();  break;
  case "week"   :  ret.setDate( ret.getDate() + 7*units );  break;
  case "day"    :  ret.setDate( ret.getDate() + units );  break;
  case "hour"   :  ret.setTime( ret.getTime() + units*3600000 );  break;
  case "minute" :  ret.setTime( ret.getTime() + units*60000 );  break;
  case "second" :  ret.setTime( ret.getTime() + units*1000 );  break;
  default       :  ret = undefined;  break;
  }
  return ret;
}
