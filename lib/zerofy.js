/**
 * Converts a number into a string with leading zeros
 *
 * @param Number number
 * @return String with zeros
 */
function zerofy(number) {
  return (number < 10 ? '0' : '') + number;
}
