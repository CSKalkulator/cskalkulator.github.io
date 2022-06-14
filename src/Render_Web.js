import React, { useState } from 'react';
import { GetCities, Calculate } from './DataOperations'

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
    const [city, setCity] = useState("Warszawa");
    const [km, setKm] = useState(0);

    const [driveMinutes, setDriveMinutes] = useState(0);
    const [parkingMinutes, setParkingMinutes] = useState(0);
    const [minutesAfterPackageUsed, setMinutesAfterPackageUsed] = useState("drive");
    const [pricelistFiltered, setPricelistFiltered] = useState(null);

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
        if (params.data !== null) {
            let rows = []
            var i = 0;
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
        }
    }

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
            <button type="Submit" onClick={() => Calculate(params.pricelist, city, km, driveMinutes, parkingMinutes, minutesAfterPackageUsed, setPricelistFiltered, setMinutesAfterPackageUsed)}>
                Oblicz
            </button><br /><br />
        </form>
            <DrawTableEntries data={pricelistFiltered} />
        </div>
    );
}