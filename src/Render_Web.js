import React, { useState } from 'react';
import { GetCities, CalculateNoLocation, CalculateWithLocation, GetLocation, GetCarsAndDistance } from './DataOperations'
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

function RenderGmap({ currentlatitude, currentlongitude, data }) {
    const containerStyle = {
        width: '400px',
        height: '400px'
    };

    const center = {
        lat: currentlatitude,
        lng: currentlongitude
    };

    function GMap({ currentlatitude, currentlongitude, data }) {
        const { isLoaded } = useJsApiLoader({
            id: 'google-map-script',
            googleMapsApiKey: "AIzaSyArk58peygXFp5ATULzYk6hmZRsGPNsxKk"
        })
        let rows = []
        let i = 1
        for (const item of data) {
            if (item.NearestCar !== null) {
                let position = {
                    lat: item.NearestCar.Latitude,
                    lng: item.NearestCar.Longitude
                }
                let row2 = null
                row2 = rows.filter(r => r.key === item.NearestCar.LicensePlate);
                if (row2.length === 0) {
                    rows.push(
                        <Marker key={item.NearestCar.LicensePlate} title={"Nr " + i}
                            icon={"https://maps.google.com/mapfiles/kml/paddle/" + i + "-lv.png"}
                            position={position}
                        />
                    )
                }
                i = i + 1
            }
        }

        rows.push(
            <Marker key={"MyLocation"} label={"start"} icon="https://maps.google.com/mapfiles/ms/micons/homegardenbusiness.png"
                position={center}
            />)
        return isLoaded ? (
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={15}
            >{rows}
            </GoogleMap>
        ) : <></>
    }
    return (<GMap currentlatitude={currentlatitude} currentlongitude={currentlongitude} data={data} />)

}

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

function DrawTableEntries(params) {
    const [currentlatitude, setLatitude] = useState(-1);
    const [currentlongitude, setLongitude] = useState(-1);
    const [locationstatus, setLocationStatus] = useState(0)
    let city = params.city
    let showNearest = params.showNearest
    if (showNearest) {
        GetLocation(currentlatitude, setLatitude, currentlongitude, setLongitude, locationstatus, setLocationStatus)
    }
    if (params.data !== null && locationstatus !== 1 && showNearest) {
        return (<div><p style={{ fontSize: 11, color: "red" }}>Lokalizacja (jeszcze) nie pozyskana. Poczekaj chwilę, upewnij się że zgoda była wydana oraz że lokalizacja została ustalona</p></div>)
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
                let carsfiltered = GetCarsAndDistance(params.cars, city, currentlatitude, currentlongitude)
                carsfiltered = carsfiltered.sort((p1, p2) => p1.distance > p2.distance ? 1 : -1);
                for (const priceitem of params.data) {
                    priceitem.NearestCar = null
                    priceitem.rank = i
                    var nc = carsfiltered.filter(c => c.Operator === priceitem.Operator && c.Group === priceitem.Grupa)
                    if (nc.length > 0) {
                        priceitem.NearestCar = nc[0]
                    }
                }
            }
            if (params.data[0].NearestCar !== undefined) {
                for (const abc of params.data) {
                    var distance = ""
                    if (abc.NearestCar !== null) {
                        if (abc.NearestCar.distance < 1000) {
                            distance = abc.NearestCar.distance + " metrów"
                        } else {
                            distance = (abc.NearestCar.distance / 1000) + " km"
                        }

                        rows.push(<tr key={i}>

                            <td>{i + 1}</td><td>{abc.nazwa}</td><td>{abc.Cena}</td><td>{distance} , {abc.NearestCar.OperatorAndModel}, {abc.NearestCar.LicensePlate}, {abc.NearestCar.Location}</td>
                        </tr>)
                        i = i + 1
                    }
                }
                return (<div><table>
                    <thead>
                        <tr><td><b>Pozycja</b></td><td><b>Koszt</b></td><td><b>Najbliższy</b></td></tr>
                    </thead><tbody>
                        {rows}
                    </tbody>
                </table><br /><DrawLocationInfo currentlatitude={currentlatitude} currentlongitude={currentlongitude} /><br />
                    <RenderGmap currentlatitude={currentlatitude} currentlongitude={currentlongitude} data={params.data} /></div>)
            }
        }
    }
}

function DrawLocationInfo({ currentlatitude, currentlongitude }) {
    return (<div style={{ fontSize: 11 }}><p>Lokalizacja (długość, szerokość): {currentlongitude},  {currentlatitude}</p></div>)
}

function DrawMinutesSection({ driveMinutes, handledriveMinutesChange, parkingMinutes, handleparkingMinutesChange, dailyOnlyMode }) {
    if (dailyOnlyMode === false) {
        return (<div style={{ display: 'inline' }}><label>
            Czas jazdy (minuty):
        </label>
            <input type="text" name='driveMinutes' value={driveMinutes} onChange={handledriveMinutesChange} />
            <label>
                Czas postoju (minuty):
            </label>
            <input type="text" name='parkingMinutes' value={parkingMinutes} onChange={handleparkingMinutesChange} />
        </div>)
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
    const [dailyOnlyMode, setDailyOnlyMode] = useState(false);
    const [daysNumber, setdaysNumber] = useState(1);
    const [averageFuelConsumption, setaverageFuelConsumption] = useState(7.5);
    const [fuelPrice, setfuelPrice] = useState(6.5);
    //const [fuelCost, setfuelCost] = useState(0);
    function DrawDaysSection({ daysNumber, handledaysNumberChange, averageFuelConsumption, handleaverageFuelConsumptionChange, fuelPrice, handlefuelPriceChange, km, dailyOnlyMode }) {
        if (dailyOnlyMode === true) {
            let fuelCost = ((averageFuelConsumption / 100) * km * fuelPrice).toFixed(2)
            //setfuelCost(fuelCost)
            return (<div style={{ display: 'inline' }}>
                <label>
                    Najem na ile dni (dób):
                </label>
                <input type="text" name='daysNumber' value={daysNumber} onChange={handledaysNumberChange} />
                <br />
                <div style={{ display: 'inline' }}><br />
                    <label>Wyliczenia aby wiedzieć czy klasyczna wypożyczalnia nie jest tańsza, po odjęciu ceny paliwa od wyliczeń CarSharingu:</label><br />
                    <label>Spalanie (L/100 km):
                        <input type="text" name='averageFuelConsumption' value={averageFuelConsumption} onChange={handleaverageFuelConsumptionChange} />
                    </label>
                    <label>
                        Cena za 1 litr paliwa :
                        <input type="text" name='fuelPrice' value={fuelPrice} onChange={handlefuelPriceChange} />
                    </label>
                    <label>
                        Wyliczony koszt paliwa : {fuelCost}
                    </label><br />
                </div>
            </div>)
        }
    }


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
    function handledaysNumberChange(event) {
        setdaysNumber(event.target.value);
    }
    function handleDailyMode(event) {
        //console.log("zmienna: " + dailyOnlyMode + "   status boxa:" + event.target.checked)
        //DrawDrivingMinutesSection(driveMinutes,handledriveMinutesChange)
        setDailyOnlyMode(event.target.checked);
    }
    function handleaverageFuelConsumptionChange(event) {
        setaverageFuelConsumption(event.target.value);
    }
    function handlefuelPriceChange(event) {
        setfuelPrice(event.target.value);
    }
    function handleSubmit(event) {
        event.preventDefault();
        /*     CalculateNoLocation(params.pricelist, city, parseInt(km), parseInt(driveMinutes), parseInt(parkingMinutes), minutesAfterPackageUsed,
                    setPricelistFiltered, setMinutesAfterPackageUsed, showNearest, setShowNearest, parseInt(daysNumber), dailyOnlyMode,averageFuelConsumption, fuelPrice)
         */
    }
    //<form onSubmit={handleSubmit}>
    return (
        <div><form onSubmit={handleSubmit}>
            <label>
                Tylko opcje dobowe (czas jazdy i postoju są ignorowane):
            </label>
            <input type="checkbox" id="chdailyinly" onChange={handleDailyMode} value={dailyOnlyMode}></input>
            <br />
            <label>
                Kilometry:
            </label>
            <input type="text" name='km' value={km} onChange={handleKMChange} />
            <br />
            <DrawMinutesSection driveMinutes={driveMinutes} handledriveMinutesChange={handledriveMinutesChange} parkingMinutes={parkingMinutes} handleparkingMinutesChange={handleparkingMinutesChange} dailyOnlyMode={dailyOnlyMode} />
            <DrawDaysSection daysNumber={daysNumber} handledaysNumberChange={handledaysNumberChange} averageFuelConsumption={averageFuelConsumption} handleaverageFuelConsumptionChange={handleaverageFuelConsumptionChange} fuelPrice={fuelPrice} handlefuelPriceChange={handlefuelPriceChange} km={parseInt(km)} dailyOnlyMode={dailyOnlyMode} />
            <br />
            <label>
                Miasto:
            </label>
            <select name='miasto' value={city} onChange={handleCityChange} >
                <RenderCitiesWeb pricelist={params.pricelist} />
            </select>
            <br />
            <button onClick={() => CalculateNoLocation(params.pricelist, city, parseInt(km), parseInt(driveMinutes), parseInt(parkingMinutes), minutesAfterPackageUsed,
                setPricelistFiltered, setMinutesAfterPackageUsed, showNearest, setShowNearest, parseInt(daysNumber), dailyOnlyMode, averageFuelConsumption, fuelPrice)}>
                Oblicz
            </button>
            <button onClick={() => CalculateWithLocation(params.pricelist, city, parseInt(km), parseInt(driveMinutes), parseInt(parkingMinutes), minutesAfterPackageUsed,
                setPricelistFiltered, setMinutesAfterPackageUsed, showNearest, setShowNearest, parseInt(daysNumber), dailyOnlyMode, averageFuelConsumption, fuelPrice)} disabled='true'>
                Oblicz z najbliższymi
            </button><br /><br />
        </form>
            <DrawTableEntries data={pricelistFiltered} cars={params.cars} showNearest={showNearest} city={city} />
        </div>
    );
}