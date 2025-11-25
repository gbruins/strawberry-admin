import { toZonedTime, getTimezoneOffset } from "date-fns-tz";
import { useI18n } from "vue-i18n";

export default function useDate() {

    const { t } = useI18n();

    function addLeadingZero(value) {
        const intVal = parseInt(value, 10);
        if (isNaN(intVal)) {
            return value;
        }

        return (intVal < 10) ? '0' + intVal : intVal;
    }


    /**
     * Date.toISOString() returns the date in ISO-8601 format with a zero UTC offset
     * as denoted by the suffix Z (e.g. 2021-01-01T00:00:00.000Z).
     * In other words it returns the date represented in UTC.
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
     *
     * For example, assuming America/Los_Angeles timezone (UTC-8):
     * const date = new Date();
     * date.setFullYear(2021);
     * date.setMonth(0);
     * date.setDate(1);
     * date.setHours(0);  <=======
     * date.setMinutes(0);
     * date.setSeconds(0);
     * date.setMilliseconds(0);
     *
     * console.log("date.toISOString()", date.toISOString());  //  2021-01-01T08:00:00.000Z
     * (note the 8am time)
     *
     * This dateTo8601 function avoids that UTC conversion and builds the date string
     * from the date object's components.
     *
     * @param {*} date
     * @returns
     */
    function dateTo8601(date) {
        if (!date) {
            return null;
        }

        const year = date.getFullYear();
        const month = addLeadingZero(date.getMonth() + 1);
        const day = addLeadingZero(date.getDate());
        const hours = addLeadingZero(date.getHours());
        const minutes = addLeadingZero(date.getMinutes());
        const seconds = addLeadingZero(date.getSeconds());

        const d = `${year}-${month}-${day}`;
        const t = `${hours}:${minutes}:${seconds}`;
        return `${d}T${t}`;
    }


    function dateObjectToZonedDateObject(d, timezone) {
        if(!d) {
            return null;
        }

        const browserDate = d || new Date();

        // Date.UTC() returns the number of milliseconds in a Date object since January 1, 1970, 00:00:00, universal time.
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/UTC
        const utc = Date.UTC(
            browserDate.getFullYear(),
            browserDate.getMonth(),
            browserDate.getDate(),
            browserDate.getHours(),
            browserDate.getMinutes(),
            browserDate.getSeconds(),
        );

    return toZonedTime(utc, timezone);
    }


    function createDateInTimezone(isoTimestamp, timezone) {
        const date = new Date(isoTimestamp);

        // get the UTC timestamp corresponding to the input timestamp
        const utcTimestamp = Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate(),
            date.getUTCHours(),
            date.getUTCMinutes(),
            date.getUTCSeconds(),
            date.getUTCMilliseconds()
        );

        // create a Date object with the adjusted timezone offset
        return new Date(utcTimestamp + getTimezoneOffset(timezone));
    }


    function convertIsoDateToTimezone(isoTimestamp, timezone) {
        const newDate = createDateInTimezone(isoTimestamp, timezone);
        return dateTo8601(newDate);
    }


    function isDaylightSavingTime() {
        const date = new Date();
        const januaryOffset = new Date(date.getFullYear(), 0, 1).getTimezoneOffset(); // get the timezone offset for January 1st
        const julyOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset(); // get the timezone offset for July 1st
        const isDst = januaryOffset !== julyOffset; // if the timezone offset is different in January and July, we're in DST

        return isDst;
    }


    function dateObjectToUtcDateObject(d) {
        const browserDate = d || new Date();
        return new Date(browserDate.getTime() + browserDate.getTimezoneOffset() * 60000);
    }


    function updateSecondsOfIso8601(iso8601, newSeconds) {
        const parts = iso8601.split('T');
        const timeParts = parts[1].split(':');
        const milliseconds = timeParts[2].split('.')[1];

        timeParts[2] = newSeconds.toString().padStart(2, '0');
        parts[1] = timeParts.join(':');

        let updated = parts.join('T');

        if (milliseconds) {
            // since the seconds are being updated I think it's safe
            // to assume the milliseconds should be zeroed out
            updated += '.000';
        }

        // if the original iso8601 string had a UTC timezone identifier, add it back
        if (iso8601.slice(-1) === 'Z') {
            updated += 'Z';
        }

        return updated;
    }


    function format8601(iso8601, dateFormat, timezone) {
        if (!iso8601) {
            return null;
        }

        if (timezone) {
            iso8601 = dateObjectToZonedDateObject(new Date(iso8601), timezone).toISOString();
        }

        const format = dateFormat || t('date.format.mdy_hm');
        const isoParts = iso8601.match(/\d+/g);


        // date part helpers
        const monthInt = parseInt(isoParts[1], 10);
        const hourMilitary = parseInt(isoParts[3], 10); // 0-23
        const hourStandard = (hourMilitary > 12)
            ? hourMilitary - 12
            : hourMilitary === 0 ? 12 : hourMilitary; // 1-12

        return format
            // year
            .replace(/\byyyy\b/g, isoParts[0]) // yyyy
            .replace(/\byy\b/g, isoParts[0].substring(4, 2)) // yy

            // month
            .replace(/\bLLLL\b/g, t(`date.month.${monthInt}`)) // LLLL
            .replace(/\bLLL\b/g, t(`date.month.${monthInt}.short`)) // LLL
            .replace(/\bLL\b/g, isoParts[1]) // LL
            .replace(/\bL\b/g, monthInt) // L

            // day
            .replace(/\bdd\b/g, isoParts[2]) // dd - padding to 2
            .replace(/\bd\b/g, parseInt(isoParts[2], 10)) // d - no padding

            // hour
            .replace(/\bHH\b/g, isoParts[3]) // HH - 24 hour time
            .replace(/\bH\b/g, hourMilitary) // H - 24 hour time, no padding
            .replace(/\bhh\b/g, addLeadingZero(hourStandard)) // hh - 12 hour time, padded
            .replace(/\bh\b/g, hourStandard) // h - 12 hour time, no padding

            // minute
            .replace(/\bmm\b/g, isoParts[4]) // mm - padded
            .replace(/\bm\b/g, parseInt(isoParts[4], 10)) // m - no padding

            // second
            .replace(/\bss\b/g, isoParts[5]) // ss - padded
            .replace(/\bs\b/g, parseInt(isoParts[5], 10)) // s - no padding

            // am/pm
            .replace(/\ba\b/g, hourMilitary > 11 ? t('date.meridiem.pm') : t('date.meridiem.am')) // a - AM/PM
    }


    function isDateObject(val) {
        return val && val instanceof Date;
        // return val && Object.prototype.toString.call(val) === '[object Date]';
    }


    return {
        addLeadingZero,
        dateTo8601,
        dateObjectToZonedDateObject,
        dateObjectToUtcDateObject,
        updateSecondsOfIso8601,
        format8601,
        isDateObject,
        convertIsoDateToTimezone,
        isDaylightSavingTime
    }

}
