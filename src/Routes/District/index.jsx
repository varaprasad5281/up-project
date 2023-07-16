/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import { DistrictModal } from '../../components'
import { onValue, ref } from 'firebase/database';
import { db } from '../../firebase';

const District = () => {
  const props = useParams();
  // '-N_OVra3xIlBL5Bin4mo&districtName=prayag'

  const districtId = props.districtId.split('&')[0];
  const districtName = props.districtId.split('&')[1].split('=')[1];
  
  const [showModal, setShowModal] = useState(false);
  const handleOpenModal = () => {
    setShowModal(true);
  }

  const [members, setMembers] = useState([]);

  useEffect(() => {

    const districtMembersRef = ref(db, `districts/${districtId}/members`);
    onValue(districtMembersRef, (snapshot) => {
      const data = snapshot.val();
      let members = [];
      for (let id in data) {
        members.push({ id, ...data[id] });
      }
      setMembers([...members]);
    })

  }, [districtId]);

  return (
    <>
      <div className='district__container flex-grow grid place-content-center'>
        <div className="container bg-gray-800 text-gray-200 rounded p-8 flex gap-4 items-center">
          <div className="district__name text-2xl font-semibold leading-4">
            District: {districtName}
          </div>
          <button className='district__modal__button bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded active:bg-gray-600' onClick={handleOpenModal}>Show members</button>
        </div>
      </div>
      {showModal ? (
        <DistrictModal setShowModal={setShowModal} members={members} />
      ) : null}
    </>

  )
}

export default District