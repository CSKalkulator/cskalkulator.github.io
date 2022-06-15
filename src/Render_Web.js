import React, { useState } from 'react';
import { GetCities, CalculateNoLocation, CalculateWithLocation, GetLocation,GetCarsAndDistance } from './DataOperations'



function RenderCitiesWeb(params) {
    if (params.pricelist !== null) {
        let cities = GetCities(params.pricelist)
        let i = 0
        let rows = []
        for (const row of cities) {
            rows.push(
                <option key={i} value={row}>{row}</option>
            )
            i = i + 1;
        }
        return (
            rows
        )
    }
}

export function RenderMainWeb(params) {
    //console.log("render2")
    const [city, setCity] = useState("Warszawa");
    const [km, setKm] = useState(0);

    const [driveMinutes, setDriveMinutes] = useState(0);
    const [parkingMinutes, setParkingMinutes] = useState(0);
    const [minutesAfterPackageUsed, setMinutesAfterPackageUsed] = useState("drive");
    const [pricelistFiltered, setPricelistFiltered] = useState(null);
    const [showNearest, setShowNearest] = useState(false);
    const [currentlatitude, setLatitude] = useState(-1);
    const [currentlongitude, setLongitude] = useState(-1);
    const [locationstatus, setLocationStatus] = useState(0)
    const [locationpermisson, setlocationpermisson] = useState("niesprawdzona")


    function handleCityChange(event) {
        setCity(event.target.value);
    }
    function handleKMChange(event) {
        setKm(event.target.value);
    }
    function handledriveMinutesChange(event) {
        setDriveMinutes(event.target.value);
    }
    function handleparkingMinutesChange(event) {
        setParkingMinutes(event.target.value);
    }
    function handleSubmit(event) {
        event.preventDefault();
    }

    function DrawTableEntries(params) {
        if (showNearest) {
            GetLocation(currentlatitude, setLatitude, currentlongitude, setLongitude, locationstatus, setLocationStatus, locationpermisson, setlocationpermisson)
        }
        if (params.data == null && locationstatus !== 0) {
            return (<div><p style={{ fontSize: 11, color: "red" }}>Lokalizacja nie pozyskana. Upewnij się że zgoda była wydana oraz że lokalizacja została ustalona</p></div>)
        }
        if (params.data !== null) {
            let rows = []
            var i = 0;
            if (showNearest === false) {
                for (const abc of params.data) {
                    rows.push(<tr key={i}>
                        <td>{abc.nazwa}</td><td>{abc.Cena}</td>
                    </tr>)
                    i = i + 1
                }
                return (<table>
                    <thead>
                        <tr><td><b>Operator</b></td><td><b>Koszt</b></td></tr>
                    </thead><tbody>
                        {rows}
                    </tbody>
                </table>)
            } else {
                if (locationstatus === 1 && currentlatitude !== -1 && currentlongitude !== -1 && params.cars !== null) {
                    let  carsfiltered =  GetCarsAndDistance (params.cars,city,currentlatitude, currentlongitude)
                    carsfiltered = carsfiltered.sort((p1, p2) => p1.distance > p2.distance ? 1 : -1);
                    for (const priceitem of params.data) {
                        priceitem.NearestCar = null
                        var nc = carsfiltered.filter(c => c.Operator === priceitem.Operator && c.Group === priceitem.Grupa)
                        if (nc.length > 0) {
                            priceitem.NearestCar = nc[0]
                        }
                    }
                }
                if (params.data[0].NearestCar !== undefined) {
                    for (const abc of params.data) {
                        rows.push(<tr key={i}>
                            <td>{abc.nazwa}</td><td>{abc.Cena}</td><td>{abc.NearestCar.distance} metrów, {abc.NearestCar.OperatorAndModel}, {abc.NearestCar.LicensePlate}, {abc.NearestCar.Location}</td>
                        </tr>)
                        i = i + 1
                    }
                    return (<table>
                        <thead>
                            <tr><td><b>Operator</b></td><td><b>Koszt</b></td><td><b>Najbliższy</b></td></tr>
                        </thead><tbody>
                            {rows}
                        </tbody>
                    </table>)
                }
            }
        }
    }
    function DrawLocationInfo() {
        return (<div style={{ fontSize: 11 }}><p>Zgoda na lokalizację: {locationpermisson}</p><p>Lokalizacja (długość, szerokość): {currentlongitude},  {currentlatitude}</p></div>)
    }

    const containerStyle = {
        width: '400px',
        height: '400px'
      };
      
      const center = {
        lat: -3.745,
        lng: -38.523
      };
      


    return (
        <div><form onSubmit={handleSubmit}>
            <label>
                Kilometry:
                <input type="text" name='km' value={km} onChange={handleKMChange} />
            </label>
            <label>
                Czas jazdy (minuty):
                <input type="text" name='driveMinutes' value={driveMinutes} onChange={handledriveMinutesChange} />
            </label>
            <label>
                Czas postoju (minuty):
                <input type="text" name='parkingMinutes' value={parkingMinutes} onChange={handleparkingMinutesChange} />
            </label>
            <label>
                <br />
                Miasto:
                <select name='miasto' value={city} onChange={handleCityChange} >
                    <RenderCitiesWeb pricelist={params.pricelist} />
                </select>
            </label><br />
            <button type="Submit" onClick={() => CalculateNoLocation(params.pricelist, city, km, driveMinutes, parkingMinutes, minutesAfterPackageUsed,
                setPricelistFiltered, setMinutesAfterPackageUsed, showNearest, setShowNearest)}>
                Oblicz
            </button>
            <button onClick={() => CalculateWithLocation(params.pricelist, city, km, driveMinutes, parkingMinutes, minutesAfterPackageUsed,
                setPricelistFiltered, setMinutesAfterPackageUsed, showNearest, setShowNearest)}>
                Oblicz z najbliższymi
            </button><br /><br />
        </form>
            <DrawTableEntries data={pricelistFiltered} cars={params.cars}  />
            <DrawLocationInfo />
        </div>
    );
}