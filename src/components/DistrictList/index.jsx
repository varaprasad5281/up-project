import { useEffect, useState } from "react"
import DistrictListItem from "../DistrictListItem"
import { onValue, ref } from "firebase/database"
import { db } from "../../firebase"

const DistrictList = () => {

    const [districts, setDistricts] = useState([])

    useEffect(() => {

        const districtsRef = ref(db, 'districts');
        onValue(districtsRef, (snapshot) => {
            const data = snapshot.val();
            const districts = [];
            for (let id in data) {
                districts.push({ id, ...data[id] });
            }
            setDistricts(districts);
        });
    }, []);

    return (
        <div className="relative items-center w-full px-5 py-12 mx-auto md:px-12 lg:px-24 max-w-7xl">
            <div className="grid w-full grid-cols-1 gap-6 mx-auto lg:grid-cols-3">
                {
                    districts.length > 0 ? districts.map((district) => <DistrictListItem key={district.id} name={district.name} link={district.id} />)
                    : <h1 className="text-2xl font-semibold text-center">No Districts Found</h1>
                }
            </div>
        </div>

    )
}

export default DistrictList