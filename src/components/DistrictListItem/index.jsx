import { Link } from "react-router-dom"

// eslint-disable-next-line react/prop-types
const DistrictListItem = ({ name, link }) => {
    return (
        <Link className="p-6" to={`district/${link}&districtName=${name}`} >
            <img className="object-cover object-center w-full mb-8 lg:h-48 md:h-36 rounded-xl" src="https://images.unsplash.com/photo-1531819177115-428566ccfb50?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y2l0eSUyMGF0JTIwbmlnaHR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60" alt="blog" />

            <h1 className="mx-auto mb-8 text-2xl font-semibold leading-none tracking-tighter text-neutral-600 lg:text-3xl">{name}</h1>
        </Link>
    )
}

export default DistrictListItem