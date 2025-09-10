import InputError from '@/Components/InputError';
import SelectInput from '@/Components/SelectInput';
import { Link, useForm } from '@inertiajs/react';
import { Modal, Button, FileInput, Label, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';




const EditModalComponent = ({ show, onClose, selectedEdit }) => {
    if (!show) return null;

    const {data, setData, post, errors, reset} = useForm({
        dept_list: selectedEdit.dept_list || '',
        _method: 'PUT',
    });

    const [loading, setLoading] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    // Update form data when selectedEdit changes
    useEffect(() => {
        if (selectedEdit) {
            setData({
                dept_list: selectedEdit.dept_list || '',
                _method: 'PUT',
            });
            setHasChanges(false);
        }
    }, [selectedEdit]);

    // Check for changes
    useEffect(() => {
        if (selectedEdit) {
            const original = {
                dept_list: selectedEdit.dept_list || '',
            };
            const isChanged = Object.keys(original).some(key => data[key] !== original[key]);
            setHasChanges(isChanged);
        }
    }, [data, selectedEdit]);

    const onSubmit =(e) =>{
        e.preventDefault();
        setLoading(true);
        // console.log("Form Data:", data); // Add this line to log form data
        post(route("departments.update", selectedEdit && selectedEdit.dept_id), {
            onSuccess: () => {
                setLoading(false);
                // console.log("Update Successful");
                onClose();
                reset();
            },
            onError: (errors) => {
                setLoading(false);
                // Handle errors if needed
                console.error(errors);
            }
        });
    }
    
    return (
        <Modal show={show} onClose={onClose }>
            <Modal.Header className="p-4">
                Edit Department - {selectedEdit && selectedEdit.dept_list}
            </Modal.Header>
            <Modal.Body className=''>
                <form action="" onSubmit={onSubmit}>
                    {/* <pre className='bg-white'>{JSON.stringify(data, undefined, 2)}</pre> */}
                    <div className="space-y-6">
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="dept_list" value="Enter Department Name" />
                            </div>
                            <TextInput
                                id="dept_list"
                                type='text'
                                name='dept_list'
                                value={data.dept_list}
                                // placeholder=""
                                // isFocused={true}
                                onChange={(e) => setData("dept_list", e.target.value)}
                                required
                            />
                            <InputError message={errors.dept_list} className='mt-2' />
                        </div>
                        
                        <div className='flex justify-end'>
                            <Link href={route('departments.index')} className='bg-gray-100 py-1 px-3 text-gray-800 rounded shadow transition-all hover:bg-gray-200 mr-2'>
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                className={`bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all ${!hasChanges || loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-emerald-600'}`}
                                disabled={!hasChanges || loading}
                            >
                                {loading ? 'Updating...' : 'Update'}
                            </button>
                        </div>
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onClose} color="blue">
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditModalComponent;