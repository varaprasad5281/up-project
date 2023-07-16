import { useRef, useState } from "react";
import MemberItem from "../MemberItem";
import { db } from "../../firebase";
import { push, ref, set } from "firebase/database";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const MemberModal = ({ id, setShowModal, members }) => {
    const [filteredMembers, setFilteredMembers] = useState([...members]);

    const handleMemberSearch = (e) => {
        const searchValue = e.target.value.toLowerCase();
        if (searchValue === '') return setFilteredMembers([...members]);
        // eslint-disable-next-line react/prop-types
        setFilteredMembers(members.filter(member => member.name.toLowerCase().includes(searchValue)));
    }

    const [showAddMemberModal, setShowAddMemberModal] = useState(false);

    const handleOpenModal = () => {
        setShowAddMemberModal(true);
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
            const sheetData = XLSX.utils.sheet_to_json(sheet);
            return alert('can implement this later')
        }
    }

    return (
        <>
            <div className="modal__overlay fixed inset-0 bg-gray-900 bg-opacity-90 flex justify-center items-center ">
                <div className="modal__container bg-gray-800 text-gray-200 rounded p-8 flex flex-col gap-4 container max-h-[90dvh] overflow-y-scroll">
                    <div className="modal__header flex justify-between items-center flex-wrap">
                        <h1 className="text-3xl font-semibold text-center">Members List </h1>
                        <div className="close__modal">
                            <button className="close__modal__button bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded active:bg-gray-600" onClick={() => setShowModal(false)}>Close</button>
                        </div>
                    </div>
                    <div className="add__header my-8 flex justify-evenly gap-4 flex-wrap items-center">
                        <div className="district__name__search border border-dashed border-gray-200">
                            <input type="search" className="search bg-gray-700 rounded px-4 py-2 text-sm sm:text-2xl font-semibold sm:leading-4" placeholder="Search members..." onChange={handleMemberSearch} />
                        </div>
                        <button onClick={handleOpenModal} className="addMembers bg-gray-200 hover:bg-gray-300 p-3 cursor-pointer font-semibold text-gray-800">Add Member</button>
                        <input type="file" name="blukUpload" id="blukUpload" placeholder="Bulk Upload" onChange={handleFileUpload} />
                    </div>
                    <div className="members__container grid w-full grid-cols-1 gap-6 mx-auto lg:grid-cols-2">
                        {
                            filteredMembers.length > 0 ? filteredMembers.map((member, idx) => <MemberItem id={id} key={idx} member={member} admin />)
                                : <div className="text-center text-2xl font-semibold">Members coming soon</div>
                        }
                    </div>
                </div>
            </div>
            {
                showAddMemberModal && <AddModal id={id} setShowAddMemberModal={setShowAddMemberModal} />
            }
        </>
    )
}

// eslint-disable-next-line react/prop-types
const AddModal = ({ id, setShowAddMemberModal }) => {

    const navigate = useNavigate();

    const nameRef = useRef(null);
    const fatherRef = useRef(null);
    const addressRef = useRef(null);
    const regsitrationRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        const name = nameRef.current.value;
        const father = fatherRef.current.value;
        const address = addressRef.current.value;
        const registration = regsitrationRef.current.value;

        if (name === '' || father === '' || address === '' || registration === '') return alert('Please fill all the fields');
        try {
            // Get the reference to the district node.
            const districtRef = ref(db, "districts/" + id + "/members");

            const pushRef = push(districtRef);
            // Create a new member object.
            const member = {
                name: name,
                father: father,
                address: address,
                registration: registration,
            };

            set(pushRef, member).then(() => {
                alert('District updated successfully')
                navigate(0, { replace: true })
            });

        } catch (error) {
            console.log(error);
            alert('Something went wrong');
        } finally {
            setShowAddMemberModal(false);
        }
    }

    return (
        <div className="modal__overlay fixed inset-0 bg-gray-900 bg-opacity-90 flex justify-center items-center ">
            <div className="modal__container bg-gray-800 text-gray-200 rounded p-8 flex flex-col gap-4 container max-h-[60dvh] max-w-lg overflow-y-scroll">
                <div className="modal__header flex justify-between items-center">
                    <h2 className="text-2xl font-semibold">Add Member</h2>
                    <span onClick={() => setShowAddMemberModal(false)} className="rounded bg-gray-200 hover:bg-gray-300 p-3 cursor-pointer font-semibold text-gray-800">
                        Close
                    </span>
                </div>

                <div className="modal__body">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="name">Name</label>
                            <input ref={nameRef} type="text" name="name" id="name" className="rounded p-2 text-gray-800" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="Fathers">Fathers Name</label>
                            <input ref={fatherRef} type="text" name="Fathers" id="Fathers" className="rounded p-2 text-gray-800" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="Address">Address</label>
                            <input ref={addressRef} type="text" name="Address" id="Address" className="rounded p-2 text-gray-800" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="Registration">Registration Number</label>
                            <input ref={regsitrationRef} type="text" name="Registration" id="Registration" className="rounded p-2 text-gray-800" />
                        </div>
                        <div className="save__button">
                            <button type="submit" className="rounded bg-gray-200 hover:bg-gray-300 p-3 cursor-pointer font-semibold text-gray-800">
                                Save
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    )
}


export default MemberModal;