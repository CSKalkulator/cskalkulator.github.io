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

export function Calculate(pricelist, city, km, driveMinutes, parkingMinutes, minutesAfterPackageUsed, setPricelistFiltered, setMinutesAfterPackageUsed) {
    if (pricelist !== null) {
        let rows = []
        for (const row of pricelist) {
            if (row.miasta.includes(city)) {
                let KM_fixed = km - row.km_free;
                let km2 = km
                if (KM_fixed > 0) {
                    km2 = KM_fixed;
                } else {
                    km2 = 0;
                }
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

                rows.push(row)
            }
        }
        if (rows.length>0) {
            rows = rows.sort(function (a, b) {
                return a.Cena - b.Cena;
            });
            setPricelistFiltered(rows);
        }       
    }
}