// import AuthenticateAdmin from '../AuthenticateAdmin'
import { Delete, Edit } from '../../icons'
import { useEffect, useRef, useState } from 'react'
import { MemberModal } from "../../components"
import { db } from '../../firebase'
import { push, ref, set, onValue, update } from "firebase/database"
import { getCookie } from '../../helper'
import Login from '../Login'

const DistrictItem = ({ district }) => {

  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  }

  const handleOpenEditModal = () => {
    setShowEditModal(true);
  }

  const handleDelete = () => {
    try {
      const districtRef = ref(db, `districts/${district.id}`);
      set(districtRef, null).then(() => alert('District deleted successfully'));
    } catch (error) {
      console.log(error)
    }
  }

  const members = [];
  if (district?.members) {
    for (let id in district?.members) {
      members.push({ id, ...district.members[id] });
    }
  }

  return (
    <>
      <li className="flex flex-col sm:flex-row justify-between gap-x-6 py-5 hover:bg-gray-100 rounded ">
        <div className="district__name flex items-center gap-x-4 mx-auto">
          <img className="h-12 w-12 flex-none rounded-full bg-gray-50" src="https://images.unsplash.com/photo-1531819177115-428566ccfb50?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y2l0eSUyMGF0JTIwbmlnaHR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60" alt="" />
          <p className="text-lg font-semibold leading-6 text-gray-900">District: {district.name}</p>
        </div>
        <div className="icons__button flex gap-3 items-center mx-auto">
          <button onClick={handleOpenModal} className="edit rounded bg-gray-200 hover:bg-gray-300 p-3 cursor-pointer font-semibold">
            View Members
          </button>
          <span onClick={handleOpenEditModal} className="edit rounded-full bg-gray-200 hover:bg-gray-300 p-4 cursor-pointer">
            <Edit />
          </span>
          <span onClick={handleDelete} className="delete rounded-full bg-gray-200 hover:bg-gray-300 p-4 cursor-pointer">
            <Delete />
          </span>
        </div>
      </li>
      {
        showModal && <MemberModal setShowModal={setShowModal} id={district.id} members={members} />
      }
      {
        showEditModal && <EditModal setShowModal={setShowEditModal} id={district.id} />
      }
    </>
  )
}

const EditModal = ({ setShowModal, id }) => {

  const districtName = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (districtName.current.value === '') return alert('Please enter district name');

    try {
      update(ref(db, `districts/${id}`), {
        name: districtName.current.value,
      }).then(() => alert('District updated successfully'));
    } catch (error) {
      console.log(error)
    } finally {
      setShowModal(false);
    }
  }

  return (
    <div className="modal__overlay fixed inset-0 bg-gray-900 bg-opacity-90 flex justify-center items-center ">
      <div className="modal__container bg-gray-800 text-gray-200 rounded p-8 flex flex-col gap-4 container max-h-[60dvh] max-w-lg">
        <div className="modal__header flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Edit District</h2>
          <span onClick={() => setShowModal(false)} className="rounded bg-gray-200 hover:bg-gray-300 p-3 cursor-pointer font-semibold text-gray-800">
            Close
          </span>
        </div>

        <div className="modal__body">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="name">Name</label>
              <input ref={districtName} type="text" name="name" id="name" className="rounded p-2 text-gray-800" />
            </div>
            <div className="save__button">
              <button type='submit' className="rounded bg-gray-200 hover:bg-gray-300 p-3 cursor-pointer font-semibold text-gray-800">
                Save
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  )
}

const AddModal = ({ setShowModal }) => {

  const districtName = useRef(null);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (districtName.current.value === '') return alert('Please enter a district name');
    try {
      setLoading(true);

      // save data to firebase realtime db
      const districtListRef = ref(db, 'districts');
      const newDistrictRef = push(districtListRef);
      set(newDistrictRef, {
        name: districtName.current.value,
        members: []
      })
        .then(() => alert('District added successfully'));
    } catch (error) {
      console.log(error);
      alert('Something went wrong');
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  }

  return (
    <div className="modal__overlay fixed inset-0 bg-gray-900 bg-opacity-90 flex justify-center items-center ">
      <div className="modal__container bg-gray-800 text-gray-200 rounded p-8 flex flex-col gap-4 container max-h-[60dvh] max-w-lg">
        <div className="modal__header flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Add District</h2>
          <span onClick={() => setShowModal(false)} className="rounded bg-gray-200 hover:bg-gray-300 p-3 cursor-pointer font-semibold text-gray-800">
            Close
          </span>
        </div>

        <div className="modal__body">
          <form onSubmit={handleSubmit} action="#" className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="name">Name</label>
              <input ref={districtName} type="text" name="name" id="name" className="rounded p-2 text-gray-800" />
            </div>
            <div className="save__button">
              <button type='submit' className="rounded bg-gray-200 hover:bg-gray-300 p-3 cursor-pointer font-semibold text-gray-800">
                {loading ? '...' : 'Save'}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  )
}

const Admin = () => {
  const token = getCookie('token');
  if (!token) {
    return <Login />
  }

  const [districtsData, setDistrictsData] = useState([]);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const districtRef = ref(db, 'districts');
    onValue(districtRef, (snapshot) => {
      const data = snapshot.val();
      const districts = [];
      for (let id in data) {
        districts.push({ id, ...data[id] });
      }
      setDistrictsData(districts);
    });

  }, []);

  const handleOpenModal = () => {
    setShowModal(true);
  }

  const handleFileUpload = (e) => {
    // parse excel file
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.readAsBinaryString(file);

    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      let sheetData = XLSX.utils.sheet_to_json(sheet);
      const res = confirm('Are you sure you want to add these district?');
      if (res) {
        try {
          sheetData.splice(0, 1);
          console.log(sheetData);

          // loop through the data and add to firebase
          const data = sheetData.map(async (item) => {
            const districtListRef = ref(db, 'districts');
            const newDistrictRef = await push(districtListRef);
            await set(newDistrictRef, {
              name: item.__EMPTY_1,
              hindiName: item.__EMPTY,
            })
          });
          alert('Districts added successfully')
        } catch (error) {
          console.log(error)
          alert('Something went wrong')
        }

      }
    }
  }

  return (
    <div className="admin my-8">
      <div className="admin__header max-w-2xl mx-auto my-8 flex justify-between">
        <h1 className="text-3xl font-semibold text-center">Admin Panel</h1>
        <button onClick={handleOpenModal} className="addMembers bg-gray-200 hover:bg-gray-300 p-3 cursor-pointer font-semibold text-gray-800">Add District</button>
        <input type="file" name="blukUpload" id="blukUpload" placeholder="Bulk Upload" onChange={handleFileUpload} />
      </div>
      <ul role="list" className="divide-y divide-gray-100 max-w-2xl mx-auto my-8" >
        {
          districtsData.length > 0 ? districtsData.map((district, index) => <DistrictItem key={index} district={district} />)
            : <li className="flex flex-col sm:flex-row justify-between gap-x-6 py-5 ">Please add districts to show here</li>
        }
      </ul>
      {
        showModal && <AddModal setShowModal={setShowModal} />
      }
    </div>
  )
}

export default Admin