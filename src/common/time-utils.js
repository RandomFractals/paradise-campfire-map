import { scaleTime } from 'd3-scale';
import { timeParse, timeFormat } from 'd3-time-format';
import { timeMonth, timeDay } from 'd3-time';
import { startDate, endDate } from './config';

// https://github.com/d3/d3-time-format#locale_format
const parseString = '%B %d %Y';
const timeFormatString = '%Y-%m-01 00:00:00';
const dayFormatString = '%B %Y';

export const timeParser = timeParse(parseString);
export const timeFormatter = timeFormat(timeFormatString);
export const dayFormatter = timeFormat(dayFormatString);

export const dayCount = timeDay.count(startDate, endDate);

export const timeScale = scaleTime()
  .range([0, dayCount])
  .domain([startDate, endDate]);
