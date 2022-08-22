import { getDistance } from 'geolib';

export function GetCities(pricelist) {
    let cities = [];
    for (const abc of pricelist) {
        for (const city of abc.miasta) {
            if (cities.includes(city) === false) {
                cities.push(city);
            }
        }
    }
    cities = cities.sort((a, b) => a.localeCompare(b))
    return cities
}

export function GetCarsAndDistance(cars, city, currentlatitude, currentlongitude) {
    let carsfiltered = cars.filter(c => c.City === city)
        .filter(c => c.Model.includes('Dokker') === false)
        .filter(c => c.Model.includes('Master') === false)
        .filter(c => c.Model.includes('Kangoo') === false)
        .filter(c => c.Model.includes('MOVANO') === false)
        .filter(c => c.Model.includes('PROACE') === false)
        .filter(c => c.Model.includes('SPRINTER') === false)
        .filter(c => c.Model.includes('EXPRESS') === false)
    for (const car of carsfiltered) {
        car.distance = getDistance(
            { latitude: currentlatitude, longitude: currentlongitude },
            { latitude: car.Latitude, longitude: car.Longitude }
        );
    }
    carsfiltered = carsfiltered.sort((p1, p2) => p1.distance > p2.distance ? 1 : -1);
    return carsfiltered
}

export function GetLocation(currentlatitude, setLatitude, currentlongitude, setLongitude, locationstatus, setLocationStatus) {
    let options = {
        enableHighAccuracy: true,
        timeout: 3000,
        maximumAge: 0,
    };

    navigator.geolocation.getCurrentPosition(
        function (position) {
            if (currentlatitude !== position.coords.latitude) setLatitude(position.coords.latitude)
            if (currentlongitude !== position.coords.longitude) setLongitude(position.coords.longitude)
            if (locationstatus !== 1) setLocationStatus(1)
        },
        function (position) { if (locationstatus !== 2) setLocationStatus(2) },
        options)

}

export function CalculateWithLocation(pricelist, city, km, driveMinutes, parkingMinutes, minutesAfterPackageUsed, setPricelistFiltered, setMinutesAfterPackageUsed, showNearest, setShowNearest, daysNumber, dailyOnlyMode) {
    if (pricelist !== null) {
        setShowNearest(true)
        let result = Calculate(pricelist, city, km, driveMinutes, parkingMinutes, minutesAfterPackageUsed, setPricelistFiltered, setMinutesAfterPackageUsed, showNearest, setShowNearest, daysNumber, dailyOnlyMode)
        setPricelistFiltered(result)
    }
}



export function CalculateNoLocation(pricelist, city, km, driveMinutes, parkingMinutes, minutesAfterPackageUsed, setPricelistFiltered, setMinutesAfterPackageUsed, showNearest, setShowNearest, daysNumber, dailyOnlyMode) {
    if (pricelist !== null) {
        setShowNearest(false)
        let result = Calculate(pricelist, city, km, driveMinutes, parkingMinutes, minutesAfterPackageUsed, setPricelistFiltered, setMinutesAfterPackageUsed, showNearest, setShowNearest, daysNumber, dailyOnlyMode)
        setPricelistFiltered(result)
    }
}

function Calculate(pricelist, city, km, driveMinutes, parkingMinutes, minutesAfterPackageUsed, setPricelistFiltered, setMinutesAfterPackageUsed, showNearest, setShowNearest, daysNumber, dailyOnlyMode) {
    if (pricelist !== null) {
        let rows = []
        for (const row of pricelist) {
            let addRow = false
            if (row.miasta.includes(city)) {
                let KM_fixed = km - row.km_free;
                let km2 = km
                if (KM_fixed > 0) {
                    km2 = KM_fixed;
                } else {
                    km2 = 0;
                }
                if (dailyOnlyMode === false) {
                    addRow = true
                    if (row.minuty_free === 0) {
                        row.Cena = (row.start + (driveMinutes * row.min_jazdy) + (parkingMinutes * row.min_postoj) + (km2 * row.km)).toFixed(2);
                    }
                    if (row.minuty_free > 0) {
                        let minuty_fixed = driveMinutes + parkingMinutes - row.minuty_free;
                        if (minuty_fixed > 0) {
                            if (minutesAfterPackageUsed === 'drive') {
                                row.Cena = (row.start + (minuty_fixed * row.min_jazdy) + (km2 * row.km)).toFixed(2);
                            }
                            if (minutesAfterPackageUsed === 'parking') {
                                row.Cena = (row.start + (minuty_fixed * row.min_postoj) + (km2 * row.km)).toFixed(2);
                            }
                        } else {
                            row.Cena = (row.start + (km2 * row.km)).toFixed(2);
                        }
                    }
                } else {
                    if (row.nazwa.includes("dobowy")) {
                        addRow = true;
                        row.Cena = (row.start + (km2 * row.km)).toFixed(2);
                        console.log("aa")
                    }
                }

                if (addRow === true) {
                    rows.push(row)
                }
            }
        }
        if (rows.length > 0) {
            rows = rows.sort(function (a, b) {
                return a.Cena - b.Cena;
            });
            //setPricelistFiltered(rows);
            return rows;
        }
    }
}