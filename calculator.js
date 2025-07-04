function msToDowntime(duration) {
    var seconds = ((duration / 1000) % 60).toFixed(2)
        , minutes = (duration / (1000 * 60) % 60).toFixed(2)
        , hours = ((duration / (1000 * 60 * 60)) % 24).toFixed(2)
        , days = ((duration / (1000 * 60 * 60 * 24))).toFixed(2);

    return {
        days: days,
        hours: hours,
        minutes: minutes,
        seconds: seconds,
    };
};

function showTime(downtime) {
    var output = "";
    for (var key in downtime) {
        if (Math.floor(downtime[key]) != 0
            || (downtime[key] > 0 && downtime[key] < 1 && key == "seconds")
        ) {
            output += downtime[key] + " " + key;
            break;
        }
    }
    return output
};

function downtimeToMs(val) {
    return 3600000 - (3600000 * (val / 100));
};

function calculateAvailabilityFromDowntime() {

    var downtimeMinutes = document.getElementById('downtime_in_minutes').value
    console.log('availability\t' + downtimeMinutes);
    var applicationDowntimeMinutesYear = downtimeMinutes * 12
    // Using 365.2425 days for an average Gregorian year
    const totalMinutesInYear = 365.2425 * 24 * 60;
    const totalMinutesInMonths = totalMinutesInYear / 12;

    if (isNaN(downtimeMinutes) || downtimeMinutes < 0) {
        return "Invalid input. Please enter a positive number.";
    }

    if (downtimeMinutes > applicationDowntimeMinutesYear) {
        // More downtime than time in a year results in 0% availability
        return "0.00000";
    }

    const availableMinutes = totalMinutesInYear - applicationDowntimeMinutesYear;
    const availabilityMinutesMonths = totalMinutesInMonths - downtimeMinutes;

    const availability = (availableMinutes / totalMinutesInYear) * 100;
    const availabilityByMonth = (availabilityMinutesMonths / totalMinutesInMonths ) * 100

    // .toFixed(5) gives a good level of precision for "nines" (e.g., 99.999%)
    var availability_year = availability.toFixed(3);
    var availability_month = availabilityByMonth.toFixed(3);

    $('#actual_availability_year').text(availability_year + '%')
    $('#actual_availability_month').text(availability_month + '%');
}

function availabilityCalculator() {

    var percentage = document.getElementById("availability");
    var currentLevel = percentage.value;
    var output;

    if (isNaN(currentLevel) || currentLevel <= 0 || currentLevel > 100) {
        output = "<em class=\"tc\">Input not valid. Please input a number between 0 and 100.</em>";
    } else {
        output =
            "<table class=\"f6 w-100 mw8 center\" cellspacing=\"0\">"
            + "<tr>"
            + "<th class=\"fw6 bb b--black-20 pb3 pr3 \">Downtime per year</th>"
            // + "<th class=\"fw6 bb b--black-20 pb3 pr3 \">Downtime per quarter</th>"
            + "<th class=\"fw6 bb b--black-20 pb3 pr3 \">Downtime per month</th>"
            // + "<th class=\"fw6 bb b--black-20 pb3 pr3 \">Downtime per week</th>"
            // + "<th class=\"fw6 bb b--black-20 pb3 pr3 \">Downtime per day</th>"
            // + "<th class=\"fw6 bb b--black-20 pb3 pr3 \">Downtime per hour</th>"
            + "</tr>";

        var ms_per_hour = downtimeToMs(currentLevel)
            , ms_per_day = ms_per_hour * 24
            , ms_per_week = ms_per_day * 7
            , ms_per_year = ms_per_day * 365.2425 // Gregorian, on average (https://en.wikipedia.org/wiki/Year#Summary)
            , ms_per_month = ms_per_year / 12
            , ms_per_quarter = ms_per_year / 4;

        // var categories = [ms_per_year, ms_per_quarter
        //     , ms_per_month, ms_per_week, ms_per_day
        //     , ms_per_hour];

        var categories = [ms_per_year, ms_per_month];

        // output += "<tr><td class=\"pr3 bb b--black-20\">" + currentLevel + "%</td>";
        for (i = 0; i < categories.length; i++) {
            if (currentLevel == 100) {
                output += "<td class=\"h6 mt-2\">" + 0 + "</td>";
            } else {
                output += "<td class=\"h6 mt-2\">" + showTime(msToDowntime(categories[i])) + "</td>";
            }
        }
        output += "</tr></table>";
    }
    document.getElementById("availability-table").innerHTML = output;
};
