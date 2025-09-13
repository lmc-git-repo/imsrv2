import Pagination from '@/Components/Pagination'
import SelectInput from '@/Components/SelectInput'
import TextInput from '@/Components/TextInput'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { ACCOUNTUSERS_STATUS_CLASS_MAP, ACCOUNTUSERS_STATUS_TEXT_MAP } from '@/constants'
import { Head, Link, router } from '@inertiajs/react'
import TableHeading from '@/Components/TableHeading'
import { Modal, Button } from 'flowbite-react';
import { useCallback, useEffect, useMemo, useState } from 'react'
// import ModalComponent from '@/Components/ModalComponent' -old component on show accountUser showModal
import useModal from '@/Components/hooks/useModal'
import useCreateModal from '@/Components/hooks/useCreateModal'
import useEditModal from '@/Components/hooks/useEditModal'

import Show from './Show'
import CreateModalComponent from './Create'
import EditModalComponent from './Edit'
import { debounce } from 'lodash'

export default function Index({auth, accountUsers, departmentsList, queryParams = null, success}) {
    
    const { showModal, selected, openModal, closeModal } = useModal();
    const { showCreateModal, openCreateModal, closeCreateModal } = useCreateModal();
    const { showEditModal, selectedEdit, openEditModal, closeEditModal } = useEditModal();

    queryParams = queryParams || {}
    const [searchQuery, setSearchQuery] = useState(queryParams.search || '');
    const [accUserStatus, setAccUserStatus] = useState(queryParams.status || '');
    const [deptUsers, setDeptUsers] = useState(queryParams.department_users || '');

    // Handle search query change with debouncing to improve performance
    const handleSearchChange = useMemo(() =>
        debounce((query) => {
    
          setSearchQuery(query);
    
          router.get(
            route('accountUsers.index'),
            {
              ...queryParams,
              search: query,
              
              // This time add other filters 
              status: accUserStatus,
              department_users: deptUsers,
              page: 1
            },
            {preserveState: true, preserveScroll: true}
          )
        }, 300), [queryParams, accUserStatus, deptUsers]); // need to add dependency for queryParams changes
    //end

    const handleFilterChange = useCallback((name, value) => {
        router.get(
          route('accountUsers.index'),
            {
                ...queryParams,
                [name]: value,
                search: searchQuery,
                page: 1
            },
            {preserveScroll: true}
        );
      }, [queryParams]);
    //end
    
    const searchFieldChanged = (value) => {
        handleSearchChange(value);
    };
    
    // Key press event handler (specifically for Enter key)
    const onKeyPress = (e) => {
        if(e.key !== 'Enter') return;
        
        searchFieldChanged(e.target.value);
    }

    const [loading, setLoading] = useState(false);
    // Update loading state based on filtering
     useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            setLoading(false);
        }, 800); // Simulate a delay, adjust based on actual data processing
        return () => clearTimeout(timer); // Cleanup timer on component unmount or if effect dependencies change
    }, [accUserStatus, deptUsers, searchQuery]);

    const handleSelectChange = (name, value) => {
        setLoading(true);
        switch (name) {
          case 'status':
            setAccUserStatus(value);
            break;
          case 'department_users':
            setDeptUsers(value);
            break;
          default:
            break;
        }
        handleFilterChange(name, value);
    };

    // Sort change handler
    const sortChanged = (name) => {
        if(name === queryParams.sort_field){
            queryParams.sort_direction = queryParams.sort_direction === 'asc' ? 'desc' : 'asc';
        } else {
            queryParams.sort_field = name;
            queryParams.sort_direction = 'asc';
        }
        router.get(route('accountUsers.index'), queryParams, { preserveScroll: true });
    };

    const deleteAccountUsers = (accountusers) => {
        if (!window.confirm('Are you sure you want to delete this employee?')) {
            return;
        }
        router.delete(route('accountUsers.destroy', accountusers.account_id))
    };    
    
  return (
    <AuthenticatedLayout
        user={auth.user}
        header={
            <div className='flex justify-between items-center'>
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">List of Employees</h2>
                {(auth.user.role === 'super admin' || auth.user.role === 'admin') && (
                    <Button 
                        onClick={() => openCreateModal()} 
                        className='bg-emerald-500 text-white rounded shadow transition-all hover:bg-emerald-600'
                    >
                        <span className='flex items-center'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                            </svg>
                            Add
                        </span>
                    </Button>
                )}
            </div>
        }
    >
        <Head title="Employees" />
        <div className="py-12">
                <div className="max-w-8xl mx-auto sm:px-6 lg:px-8">
                    {success && (
                        <div id="alert-border-3" className="flex items-center p-4 mb-4 text-green-800 border-t-4 border-green-300 bg-green-50 dark:text-green-400 dark:bg-slate-800 dark:border-green-800" role="alert">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                            <div className="ms-3 text-sm font-medium">
                                {success}
                            </div>
                            <button onClick={() => router.get(route('accountUsers.index'))} type="button" className="ms-auto -mx-1.5 -my-1.5 bg-green-50 text-green-500 rounded-lg focus:ring-2 focus:ring-green-400 p-1.5 hover:bg-green-200 inline-flex items-center justify-center h-8 w-8 dark:bg-slate-800 dark:text-green-400 dark:hover:bg-gray-700"  data-dismiss-target="#alert-border-3" aria-label="Close">
                                <span className="sr-only">Dismiss</span>
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                </svg>
                            </button>
                        </div>
                    )}
                    <div className="bg-white dark:bg-slate-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {/* <pre>{JSON.stringify(accountUsers, undefined, 2)}</pre> */}
                            <div className="overflow-auto">
                                <div className="flex justify-between items-center py-2">
                                    <div>
                                        <TextInput 
                                            className="w-full"
                                            defaultValue={searchQuery} 
                                            placeholder="Employee Name"
                                            onBlur={e => searchFieldChanged(e.target.value)}
                                            onChange={(e) => searchFieldChanged(e.target.value)}
                                            onKeyPress={e => onKeyPress(e)} 
                                        />
                                    </div>
                                    <div>
                                        <SelectInput 
                                            className="w-full text-sm h-8 py-1"
                                            defaultValue={deptUsers}
                                            onChange={(e) => handleSelectChange('department_users', e.target.value)}
                                        >
                                            <option value="">Select Department</option>
                                            {departmentsList.data.map(dept => (
                                                <option key={dept.dept_id} value={dept.dept_list}>
                                                    {dept.dept_list}
                                                </option>
                                            ))}
                                        </SelectInput>
                                    </div>
                                    <div>
                                        <SelectInput 
                                            className="w-full text-sm h-8 py-1"
                                            defaultValue={accUserStatus} 
                                            onChange={ (e) => handleSelectChange('status', e.target.value)}
                                        >
                                            <option value="">Select Status</option>
                                            <option value="Employed">Employed</option>
                                            <option value="Resigned">Resigned</option>
                                            <option value="Terminated">Terminated</option>
                                        </SelectInput>
                                    </div>
                                </div>
                                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                        <tr className="text-nowrap">
                                            <TableHeading
                                                name="account_id"
                                                sort_field={queryParams.sort_field} 
                                                sort_direction={queryParams.sort_direction}
                                                sortChanged={sortChanged}
                                            >
                                                ACC_ID
                                            </TableHeading>
                                            <TableHeading
                                                name="name"
                                                sort_field={queryParams.sort_field} 
                                                sort_direction={queryParams.sort_direction}
                                                sortChanged={sortChanged}
                                            >
                                                Name
                                            </TableHeading>
                                            <th className="px-3 py-3">Profile</th>
                                            <TableHeading
                                                name="department_users"
                                                sort_field={queryParams.sort_field} 
                                                sort_direction={queryParams.sort_direction}
                                                sortChanged={sortChanged}
                                            >
                                                Department
                                            </TableHeading>
                                            <TableHeading
                                                name="initial"
                                                sort_field={queryParams.sort_field} 
                                                sort_direction={queryParams.sort_direction}
                                                sortChanged={sortChanged}
                                            >
                                                Initials
                                            </TableHeading>

                                            <TableHeading
                                                name="outlookEmail"
                                                sort_field={queryParams.sort_field} 
                                                sort_direction={queryParams.sort_direction}
                                                sortChanged={sortChanged}
                                            >
                                                Email
                                            </TableHeading>

                                            <TableHeading
                                                name="status"
                                                sort_field={queryParams.sort_field} 
                                                sort_direction={queryParams.sort_direction}
                                                sortChanged={sortChanged}
                                            >
                                                Status
                                            </TableHeading>
                                            <th className="px-3 py-3">Created By</th>
                                            <TableHeading
                                                name="created_at"
                                                sort_field={queryParams.sort_field} 
                                                sort_direction={queryParams.sort_direction}
                                                sortChanged={sortChanged}
                                            >
                                                Created Date
                                            </TableHeading>
                                            {(auth.user.role === 'super admin' || auth.user.role === 'admin') && (
                                                <th className="px-3 py-3 text-center">Actions</th>
                                            )}
                                        </tr>
                                    </thead>
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                        <tr className="text-nowrap">
                                            <th className="px-3 py-3"></th>
                                            <th className="px-3 py-3"></th>
                                            <th className="px-3 py-3"></th>
                                            <th className="px-3 py-3"></th>
                                            <th className="px-3 py-3"></th>
                                            <th className="px-3 py-3"></th>
                                            <th className="px-3 py-3">
                                            </th>
                                            <th className="px-3 py-3"></th>
                                            <th className="px-3 py-3"></th>
                                            {(auth.user.role === 'super admin' || auth.user.role === 'admin') && (
                                                <th className="px-3 py-3"></th>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr className="text-center">
                                                <td colSpan="17" className="py-4 text-gray-500">Please wait while rendering...</td>
                                            </tr>
                                        ) : accountUsers.data && accountUsers.data.length > 0 ? (
                                                accountUsers.data.map(accountusers => (
                                                    <tr className="bg-white border-b dark:bg-slate-800 dark:border-gray-700" key={accountusers.account_id}>
                                                        <td className="px-3 py-2">{accountusers.account_id}</td>
                                                        <th className="px-3 py-2 hover:underline hover:text-white">
                                                            {/* <Link href={route("accountUsers.show", { account_id: accountusers.account_id })}>
                                                                {accountusers.name}
                                                            </Link> */}
                                                            <Link href="#" onClick={(e) => openModal(accountusers, e)}>
                                                                {accountusers.name}
                                                            </Link>
                                                        </th>
                                                        <td className="px-3 py-2">
                                                            <img src={accountusers.profile_path} alt="" style={{width: 60}} />
                                                        </td>
                                                        <td className="px-3 py-2">{accountusers.department_users}</td>
                                                        <td className="px-3 py-2">{accountusers.initial}</td>
                                                        <td className="px-3 py-2">{accountusers.outlookEmail}</td>
                                                        <td className="px-3 py-2">
                                                            <span className={'px-2 rounded-e-full text-white ' + ACCOUNTUSERS_STATUS_CLASS_MAP[accountusers.status]}>{ACCOUNTUSERS_STATUS_TEXT_MAP[accountusers.status]}</span>
                                                        </td>
                                                        <td className="px-3 py-2">{accountusers.createdBy.name}</td>
                                                        <td className="px-3 py-2 text-nowrap">{accountusers.created_at}</td>
                                                        {(auth.user.role === 'super admin' || auth.user.role === 'admin') && (
                                                            <td className="px-3 py-2 text-center text-nowrap">
                                                                {/* <Link href={route('accountUsers.edit', accountusers.account_id)} className="font-medium inline-block py-1 px-2 rounded-lg  text-white  bg-blue-600 hover:bg-blue-700 mx-1">Edit</Link> */}
                                                                <button
                                                                    className="inline-block py-1 px-2  text-blue-500 hover:text-blue-300 hover:scale-110 hover:animate-spin mx-1"
                                                                    onClick={() => openEditModal(accountusers)}
                                                                >
                                                                    <span className='flex items-center justify-center'>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                                                        </svg>
                                                                    </span>
                                                                </button>
                                                            
                                                                <button
                                                                    onClick={(e) => deleteAccountUsers(accountusers)}
                                                                    className="inline-block py-1 px-2 text-red-500 hover:text-red-700 hover:scale-110 hover:animate-bounce mx-1"
                                                                >
                                                                    <span className='flex items-center justify-center'>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                                        </svg>
                                                                    </span>
                                                                </button>
                                                            </td>
                                                        )}
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr className='text-center'>
                                                    <td className='font-medium text-base py-4' colSpan="17">No data available</td>
                                                </tr>
                                            )
                                        }
                                    </tbody>
                                </table>
                            </div>
                            <Pagination 
                                links={accountUsers.meta.links}
                                queryParams={{
                                    search: searchQuery,
                                    status: accUserStatus,
                                    department_users: deptUsers
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <Show show={showModal} onClose={closeModal} user={selected} />
            <CreateModalComponent show={showCreateModal} onClose={closeCreateModal} departmentsList={departmentsList.data} />
            <EditModalComponent 
                show={showEditModal} 
                onClose={closeEditModal} 
                listDepartments={departmentsList.data}
                selectedEditUser={selectedEdit}
            />

    </AuthenticatedLayout>
  )
}
