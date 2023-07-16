/* eslint-disable react/prop-types */
import { useState } from 'react';
import MemberItem from '../MemberItem'

// eslint-disable-next-line react/prop-types
const DistrictModal = ({ members, setShowModal }) => {

  const [filteredMembers, setFilteredMembers] = useState([...members]);

  const handleMemberSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    if(searchValue === '') return setFilteredMembers([...members]);
    setFilteredMembers(members.filter(member => member.name.toLowerCase().includes(searchValue)));
  }

  return (
    <>
      <div className="modal__overlay fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center ">
        <div className="modal__container bg-gray-800 text-gray-200 rounded p-8 flex flex-col gap-4 container min-h-[50dvh]">
          <div className="modal__header flex justify-between items-center flex-wrap">
            <div className="district__name__search border border-dashed border-gray-200">
              <input type="search" className="search bg-gray-700 rounded px-4 py-2 text-sm sm:text-2xl font-semibold sm:leading-4" placeholder="Search members..." onChange={handleMemberSearch} />
            </div>
            <div className="close__modal">
              <button className="close__modal__button bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded active:bg-gray-600" onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
          <div className="members__container grid w-full grid-cols-1 gap-6 mx-auto lg:grid-cols-2">
            {
              filteredMembers.length > 0 ? filteredMembers.map((member, idx) => <MemberItem key={idx} member={member} />)
              : <p className="text-center text-2xl font-semibold">Members comming soon</p>
            }
          </div>
        </div>
      </div>
    </>
  )
}

export default DistrictModal