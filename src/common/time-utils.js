import { scaleTime } from 'd3-scale';
import { utcFormat } from 'd3-time-format';
import { startDate, endDate } from './config';

// https://github.com/d3/d3-time-format#locale_format
const timeFormatString = '%Y-%m-%d 00:00:00';
const dayFormatString = '%B %d, %A, %I %p'; // November 8, Monday, 6 AM

export const timeFormatter = utcFormat(timeFormatString);
export const dayFormatter = utcFormat(dayFormatString);

export const dayCount = Math.round(Math.abs(endDate.getTime() - startDate.getTime())/8.64e7); // msecs in a day
export const ticksPerDay = 4; // every 6 hours
export const timeScale = scaleTime()
  .range([0, dayCount * ticksPerDay])
  .domain([startDate, endDate]);
