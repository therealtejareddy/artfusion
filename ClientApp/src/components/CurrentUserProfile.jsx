import React from 'react'

function CurrentUserProfile({currentUser}) {
    // let currentUser = currentUser
  return (
        currentUser ? 
        <div className="user-profile w-full min-w-[72rem] -z-10">
                            <div className="profile-page">
                            <section className="relative block h-[350px]">
                                <div className="absolute top-0 w-full h-full bg-center bg-cover" style={{
                                        backgroundImage: currentUser.coverPicURL ? `url('${currentUser.coverPicURL}')` : `url('https://api.dicebear.com/6.x/shapes/svg?seed=${currentUser.firstName}')`
                                }}>
                                <span id="blackOverlay" className="w-full h-full absolute opacity-50 bg-black"></span>
                                </div>
                                <div className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden h-70-px" style={{transform: "translateZ(0px)"}}>
                                <svg className="absolute bottom-0 overflow-hidden" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" version="1.1" viewBox="0 0 2560 100" x="0" y="0">
                                    <polygon className="text-blueGray-200 fill-current" points="2560 0 2560 100 0 100"></polygon>
                                </svg>
                                </div>
                            </section>
                            <section className="relative py-8">
                                <div className="container mx-auto px-4">
                                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
                                    <div className="px-6">
                                    <div className="flex flex-wrap justify-center">
                                        <div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
                                        <div className="relative">
                                            {
                                                currentUser && currentUser.profilePicURL ? <img alt="..." src={currentUser.profilePicURL} className="shadow-xl rounded-full max-h-[150px] min-h-[150px] align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 w-[24rem] max-w-150-px"/> :
                                                <img alt="..." src={`https://api.dicebear.com/6.x/adventurer-neutral/svg?seed=${currentUser.firstName} ${currentUser.lastName}`} className="shadow-xl rounded-full max-h-[150px] min-h-[150px] align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-150-px"/>
                                            }
                                        </div>
                                        </div>
                                        <div className="w-full lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center">
                                        <div className="py-6 px-3 mt-32 sm:mt-0">
                                        </div>
                                        </div>
                                        <div className="w-full lg:w-4/12 px-4 lg:order-1">
                                        <div className="flex justify-center py-4 lg:pt-4 pt-8">
                                            <div className="mr-4 p-3 text-center">
                                            <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">{currentUser? currentUser.listedProducts.length : 0}</span><span className="text-sm text-blueGray-400">Arts</span>
                                            </div>
                                            <div className="mr-4 p-3 text-center">
                                            <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">{currentUser ? currentUser.soldOutProducts.length : 0}</span><span className="text-sm text-blueGray-400">Sold Out</span>
                                            </div>
                                            <div className="lg:mr-4 p-3 text-center">
                                            <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">{currentUser ? currentUser.followersCount : 0}</span><span className="text-sm text-blueGray-400">Followers</span>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                    <div className="text-center mt-2 pb-6">
                                        <h3 className="text-4xl font-semibold leading-normal mb-2 text-blueGray-700 mb-2">
                                        {currentUser && currentUser.firstName}{' '}{currentUser && currentUser.lastName}
                                        </h3>
                                        {
                                            currentUser && currentUser.state && 
                                            <div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">
                                                <i className="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"></i>
                                                {currentUser.city}, {currentUser.state}
                                            </div>
                                        }
                                    </div>
                                    </div>
                                </div>
                                </div>
                            </section>
                        </div>
                            
        </div>
        : null
  )
}

export default CurrentUserProfile