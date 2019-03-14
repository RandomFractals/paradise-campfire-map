import { scaleTime } from 'd3-scale';
import { utcFormat } from 'd3-time-format';
import { startDate, endDate, ticksPerDay } from './config';

// see: https://github.com/d3/d3-time-format#locale_format
const timeFormatString = '%Y-%m-%d %H:00:00';
const dayFormatString = '%B %d, %A, %I %p'; // November 8, Monday, 6 AM
const MSECS_PER_DAY = 1000 * 60 * 60 * 24;

export const timeFormatter = utcFormat(timeFormatString);
export const dayFormatter = utcFormat(dayFormatString);

export const dayCount = Math.round(
  Math.abs(endDate.getTime() - startDate.getTime())/MSECS_PER_DAY);

export const timeScale = scaleTime()
  .range([0, dayCount * ticksPerDay])
  .domain([startDate, endDate]);
