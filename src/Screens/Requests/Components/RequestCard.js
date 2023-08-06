import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { acceptRequest, getUserDataUid, declineRequest } from '../../../Services/firebase'
import { Avatar } from "@mui/material";
import { useNavigate } from 'react-router';

export default function RequestCard({ item, uid, refetch, openSnackbar }) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { status, data: userdata } = useQuery({
    queryKey: ['user_request', uid],
    queryFn: () => getUserDataUid(uid)
  }, { enabled: false })



  if (status === 'loading') {
    return <div></div>
  }

  const handleAccept = () => {
    acceptRequest(uid, item.senderId)
    openSnackbar({ message: 'Request accepted.' })
  }

  const handleDecline = () => {
    declineRequest(uid, item.senderId)
    openSnackbar({ message: 'Request declined.', severity: 'error' })
  }


  const displayMessage = () => {
    if (item.requestType === 'friend') {
      return 'has sent you a friend request.'
    } else if (item.requestType === 'Membership') {
      return 'wants to be a member of your gym.'
    } else if (item.requestType === 'Employment') {
      return 'wants to be an instructor at your gym.'
    }
  }


  return (
    <div className='flex flex-col  m-2 hover:cursor-pointer  rounded-lg p-3 shadow'>
      {/* <p className='flex items-center'>
      <span onClick={() => {navigate(`/${uid}`)}} className='flex border w-fit hover:bg-gray-100 p-1 rounded-full'>
        <Avatar sx={{width:30, height: 30}} src={userdata?.photoUrl}/>
        <div className='flex flex-col ml-1 mr-2 justify-center items-start'>
            <p className='font-semibold text-md text-clip truncate'>{userdata?.fullname}</p>
        </div>
      </span>
      <p className='ml-2'>{displayMessage()}</p>
      </p> */}
      <div className='flex break-all'>
        <span>
        <Avatar className='float-right' sx={{ width: 30, height: 30 }} src={userdata?.photoUrl} />
        </span>
        <p>fahsdfhdsfhsdfbkjdskjflsdjhfkjdshfjkhsdkjflsfdkjdslhkj</p>
      </div>
      <div className='flex items-end justify-end mt-3 mr-2 space-x-4'>
        <button onClick={handleAccept} className='border hover:bg-blue-600 bg-blue-500 rounded-md px-8 py-2 justify-center items-center font-semibold text-white text-center text-sm'>Accept</button>
        <button onClick={handleDecline} className='border border-black rounded-md px-8 py-2 justify-center hover:text-rose-500 hover:border-red-500 items-center font-semibold text-center text-sm'>Decline</button>
      </div>
    </div>
  )
}
