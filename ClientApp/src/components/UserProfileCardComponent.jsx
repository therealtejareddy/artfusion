import React from 'react'
import {useNavigate} from 'react-router-dom'

function UserProfileCardComponent({userId, userName, firstName, lastName, email,followersCount, soldOutCount, listedCount, coverPicURL, profilePicURL}) {
  const navigate = useNavigate()
	return (
    <div onClick={()=>{
		navigate(`/profile/${userId}`)
	}} class="m-2 card max-w-sm border border-gray-100 bg-purple-100 transition-shadow shadow-xl hover:shadow-xl">
        <div class="w-full card__media">
				{
                coverPicURL? <img src={coverPicURL} class="h-48 w-full object-cover" alt="cover pic"/>:<img src={`https://api.dicebear.com/6.x/shapes/svg?seed=${firstName}`} class="h-48 w-full object-cover" alt="cover pic"/>
            }
        </div>
				<div class="  card__media--aside "></div>
				<div class="flex items-center p-4">
					<div class="relative flex flex-col items-center w-full">
						<div
							class="h-24 w-24 md rounded-full relative avatar flex items-end justify-end text-purple-600 min-w-max absolute -top-16 flex bg-purple-200 text-purple-100 row-start-1 row-end-3 text-purple-650 ring-1 ring-white">
                            {
                                profilePicURL? <img src={profilePicURL} class="h-24 w-24 md rounded-full relative" alt="cover pic"/>:<img src={`https://api.dicebear.com/6.x/adventurer-neutral/svg?seed=${firstName} ${lastName}`} class="h-24 w-24 md rounded-full relative" alt="cover pic"/>
                            }
							<div class="absolute"></div>
						</div>
						<div class="flex flex-col space-y-1 justify-center items-center -mt-12 w-full">
							<span class="text-md whitespace-nowrap text-gray-800 font-semibold">{firstName} {lastName}</span>
                            <span class="text-md whitespace-nowrap text-gray-600">{userName}</span>
							<div
								class="py-4 flex justify-center items-center w-full divide-x divide-gray-400 divide-solid">
								<span class="text-center px-2"><span class="font-bold text-gray-700">{listedCount}</span><span class="text-gray-600"> Listed</span></span><span class="text-center px-2"><span class="font-bold text-gray-700">{soldOutCount}</span><span class="text-gray-600"> Sold Out</span></span><span class="text-center px-2"><span class="font-bold text-gray-700">{followersCount}</span><span class="text-gray-600"> Followers</span></span>
							</div>
						</div>
					</div>
				</div>
			</div>
  )
}

export default UserProfileCardComponent