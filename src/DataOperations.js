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

export function CalculateWithLocation(pricelist, city, km, driveMinutes, parkingMinutes, minutesAfterPackageUsed, setPricelistFiltered, setMinutesAfterPackageUsed, showNearest, setShowNearest, daysNumber, dailyOnlyMode, averageFuelConsumption, fuelPrice) {
    if (pricelist !== null) {
        setShowNearest(true)
        let result = Calculate(pricelist, city, km, driveMinutes, parkingMinutes, minutesAfterPackageUsed, setPricelistFiltered, setMinutesAfterPackageUsed, showNearest, setShowNearest, daysNumber, dailyOnlyMode, averageFuelConsumption, fuelPrice)
        setPricelistFiltered(result)
    }
}



export function CalculateNoLocation(pricelist, city, km, driveMinutes, parkingMinutes, minutesAfterPackageUsed, setPricelistFiltered, setMinutesAfterPackageUsed, showNearest, setShowNearest, daysNumber, dailyOnlyMode, averageFuelConsumption, fuelPrice) {
    if (pricelist !== null) {
        setShowNearest(false)
        let result = Calculate(pricelist, city, km, driveMinutes, parkingMinutes, minutesAfterPackageUsed, setPricelistFiltered, setMinutesAfterPackageUsed, showNearest, setShowNearest, daysNumber, dailyOnlyMode, averageFuelConsumption, fuelPrice)
        setPricelistFiltered(result)
    }
}

function Calculate(pricelist, city, km, driveMinutes, parkingMinutes, minutesAfterPackageUsed, setPricelistFiltered, setMinutesAfterPackageUsed, showNearest, setShowNearest, daysNumber, dailyOnlyMode, averageFuelConsumption, fuelPrice) {
    if (pricelist !== null) {
        let rows = []
        for (const row of pricelist) {
            let addRow = false
            row.CenaB = 0
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
                    let calculated = false
                    if (row.km_widelki != null) {
                        let cost_km = 0;
                        let cost_parking = 0;
                        calculated = true
                        row.km_widelki = row.km_widelki.sort(function (a, b) {
                            return a.od - b.od;
                        });
                        for (const row2 of row.km_widelki) {
                            let km_this_range = 0;
                            if (km2 > 0) {
                                if (km2 > row2.do) {
                                    km_this_range = row2.do
                                    km2 = km2 - row2.do
                                } else {
                                    km_this_range = km2;
                                    km2 = km2 = 0
                                }
                                cost_km = cost_km +(km_this_range * row2.cena_za_km);
                                //km2 = km2 - km_this_range;    
                            }
                        }
                        cost_parking = parkingMinutes * row.min_postoj;
                        if (cost_parking> row.min_postoj_max_kwota_dobowa){
                            cost_parking = row.min_postoj_max_kwota_dobowa;
                        }
                        row.Cena = cost_km + cost_parking;
                        row.CenaB = row.Cena;
                        calculated = true;
                    }
                    if (!calculated) {
                        if (row.minuty_free === 0) {
                            row.Cena = (row.start + (driveMinutes * row.min_jazdy) + (parkingMinutes * row.min_postoj) + (km2 * row.km)).toFixed(2);
                            row.CenaB = row.Cena
                            calculated = true
                        }
                    }
                    if (!calculated) {
                        if (row.minuty_free > 0) {
                            let minuty_fixed = driveMinutes + parkingMinutes - row.minuty_free;
                            if (minuty_fixed > 0) {
                                if (minutesAfterPackageUsed === 'drive') {
                                    row.Cena = (row.start + (minuty_fixed * row.min_jazdy) + (km2 * row.km)).toFixed(2);
                                    row.CenaB = row.Cena
                                }
                                if (minutesAfterPackageUsed === 'parking') {
                                    row.Cena = (row.start + (minuty_fixed * row.min_postoj) + (km2 * row.km)).toFixed(2);
                                    row.CenaB = row.Cena
                                }
                            } else {
                                row.Cena = (row.start + (km2 * row.km)).toFixed(2);
                                row.CenaB = row.Cena
                            }
                        }
                        calculated = true
                    }
                } else {
                    if (row.nazwa.includes("dobowy")) {
                        addRow = true;
                        let cena = (row.start * daysNumber + (km2 * row.km)).toFixed(2)
                        let fuelCost = ((averageFuelConsumption / 100) * km * fuelPrice).toFixed(2)
                        let maxClassicRentalPerDay = ((cena - fuelCost) / daysNumber).toFixed(2)
                        row.CenaB = cena
                        row.Cena = cena + " ; po odjęciu wyliczonego (wyżej) kosztu paliwa:" + ((cena - fuelCost).toFixed(2)) + ";     maksymalna, porównywalna cena za dobę wynajmu klasycznego bez limitu km: " + maxClassicRentalPerDay;
                    }
                }

                if (addRow === true) {
                    rows.push(row)
                }
            }
        }
        if (rows.length > 0) {
            rows = rows.sort(function (a, b) {
                return a.CenaB - b.CenaB;
            });
            //setPricelistFiltered(rows);
            return rows;
        }
    }
}