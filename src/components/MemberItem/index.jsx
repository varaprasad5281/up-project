/* eslint-disable react/prop-types */
import { useState } from "react";
import { Edit, Delete } from "../../icons"
import { ref, set, update } from "firebase/database";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const MemberItem = ({ id, member, admin }) => {

    const navigation = useNavigate();

    const [showEditModal, setShowEditModal] = useState(false);

    const handleEditOpenModal = () => {
        setShowEditModal(true);
    }
    const handleDelete = () => {
        const memberRef = ref(db, `districts/${id}/members/${member.id}`);
        set(memberRef, null).then(() => {
            alert('Member deleted successfully');
            navigation(0, { replace: true });
        });
    }

    return (
        <div className="member__container bg-gray-700 rounded p-4 flex flex-col gap-4 items-center">
            <div className="member__info flex flex-col gap-2 truncate text-center">

                <div className="member__name text-xl font-semibold leading-4">
                    {/* eslint-disable-next-line react/prop-types */}
                    {member.name}
                </div>
                <div className="member__father text-xl font-semibold leading-4">
                    {/* eslint-disable-next-line react/prop-types */}
                    {member.father}
                </div>
                <div className="member__address text-xl font-semibold leading-4">
                    {/* eslint-disable-next-line react/prop-types */}
                    {member.address}
                </div>
                <div className="member__registration text-xl font-semibold leading-4">
                    {/* eslint-disable-next-line react/prop-types */}
                    {member.registration}
                </div>
            </div>

            {
                admin && <div className="icons flex gap-3 items-center">
                    <span onClick={handleEditOpenModal} className="edit rounded bg-gray-200 hover:bg-gray-300 p-2 cursor-pointer text-gray-800 flex gap-3 items-center ">
                        Edit <Edit />
                    </span>
                    <span onClick={handleDelete} className="delete rounded bg-red-400 hover:bg-red-500 p-2 cursor-pointer text-gray-800 flex gap-3 items-center ">
                        Delete <Delete />
                    </span>
                </div>
            }

            {
                showEditModal && <EditModal id={id} member={member} setShowEditModal={setShowEditModal} />
            }

        </div>
    )
}

const EditModal = ({ id, member, setShowEditModal }) => {

    const navigation = useNavigate();

    const [name, setName] = useState(member.name);
    const [father, setFather] = useState(member.father);
    const [address, setAddress] = useState(member.address);
    const [registration, setRegistration] = useState(member.registration);

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            const data = {
                name,
                father,
                address,
                registration,
            }
            console.log(data);
            update(ref(db, `districts/${id}/members/${member.id}`), data).then(() => {
                alert("Member Updated Successfully");
                navigation(0, { replace: true });
            });
        } catch (error) {
            console.log(error)
        } finally {
            setShowEditModal(false);
        }
    }

    return (
        <div className="modal__overlay fixed inset-0 bg-gray-900 bg-opacity-90 flex justify-center items-center ">
            <div className="modal__container bg-gray-800 text-gray-200 rounded p-8 flex flex-col gap-4 container max-h-[60dvh] max-w-lg overflow-y-scroll">
                <div className="modal__header flex justify-between items-center">
                    <h2 className="text-2xl font-semibold">Edit District</h2>
                    <span onClick={() => setShowEditModal(false)} className="rounded bg-gray-200 hover:bg-gray-300 p-3 cursor-pointer font-semibold text-gray-800">
                        Close
                    </span>
                </div>

                <div className="modal__body">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="name">Name</label>
                            <input value={name} onChange={(e) => setName(e.target.value)} type="text" name="name" id="name" className="rounded p-2 text-gray-800" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="memberFatherName">Father Name</label>
                            <input value={father} onChange={(e) => setFather(e.target.value)} type="text" name="memberFatherName" id="memberFatherName" className="rounded p-2 text-gray-800" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="memberAdd">Address</label>
                            <input value={address} onChange={(e) => setAddress(e.target.value)} type="text" name="memberAdd" id="memberAdd" className="rounded p-2 text-gray-800" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="memberRegistration">Registration No.</label>
                            <input value={registration} onChange={(e) => setRegistration(e.target.value)} type="text" name="memberRegistration" id="memberRegistration" className="rounded p-2 text-gray-800" />
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

export default MemberItem