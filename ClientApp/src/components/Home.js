import React, {useContext, useEffect, useRef} from 'react'
import authContext from '../context/authContext'
import {useNavigate, Link} from "react-router-dom"
import KuteJs from "kute.js"

function Home() {
  const path1 = useRef()
  const path2 = useRef()
  const { userData } = useContext(authContext);
    let navigate = useNavigate()
    useEffect(() => {
      if(userData!=null){
        navigate("/products")
      }
      console.log(KuteJs);
      KuteJs.fromTo(path1.current,
      {path:path1.current},
      {path:"#path-to1"},
      {repeat:Infinity, duration:900, yoyo:true}
      ).start()
      KuteJs.fromTo(path2.current,
      {path:path2.current},
      {path:"#path-to2"},
      {repeat:Infinity, duration:900, yoyo:true}
      ).start()
    }, [userData])
  return (
    <div className="overflow-x-hidden w-screen">
      <div className="h-screen w-screen bg-gradient-to-tr from-slate-300 via-slate-800 to-gray-500 ">
        <div className="mx-auto max-w-3xl pt-[8rem] text-center font-mono text-white">
          <h1 className="text-9xl font-black">ArtFusion</h1>
                 {/* <p className="pt-4">Welcome to our vibrant world of artistic expression! Our art ecommerce website is a haven for art enthusiasts and collectors alike, offering a carefully curated selection of captivating artworks that ignite the imagination and stir the soul.</p>
                  <p>Browse our intuitive and user-friendly platform, where you can effortlessly navigate through various categories, artists, and themes. Immerse yourself in the rich narratives woven into each piece, as artists pour their emotions, perspectives, and inspirations onto the canvas. Delve into the stories behind the artwork, exploring the depths of meaning and the creative processes that brought them to life.</p>
                  */}<p className="pt-4 text-3xl py-6">Join us in celebrating the limitless possibilities of artistic expression. Start exploring our collection today and let the magic of art touch your heart.</p>
          <div>
            <Link to="/sign-up" className="cursor-pointer no-underline text-lg font-bold text-white px-[6rem] py-2 rounded-md hover:bg-gradient-to-t bg-gradient-to-br from-green-500 via-green-600 to-green-700">Sign Up</Link>
          </div>
        </div>
        <div className="h-screen w-screen absolute inset-0 z-0">
          <svg id="visual" viewBox="0 0 900 600" className="h-full w-full">
            <g transform="translate(1090, 0)"><path className="fill-blue-500" ref={path1} id="path-from1" d="M0 351.5C-20.4 310.7 -40.8 269.8 -70.7 263.7C-100.5 257.6 -139.8 286.2 -162.5 281.5C-185.2 276.7 -191.4 238.7 -219.2 219.2C-247 199.7 -296.4 198.7 -304.4 175.8C-312.5 152.8 -279.2 108 -280.1 75.1C-281.1 42.1 -316.3 21.1 -351.5 0L0 0Z"></path></g>
            <g transform="translate(-190, 600)"><path className="fill-blue-500" ref={path2} id="path-from2" d="M0 -351.5C19.6 -308 39.1 -264.4 69.1 -257.9C99.1 -251.4 139.6 -282.1 156 -270.2C172.4 -258.3 164.9 -203.8 179.6 -179.6C194.3 -155.4 231.3 -161.6 264.1 -152.5C297 -143.4 325.7 -119 339.6 -91C353.4 -63 352.5 -31.5 351.5 0L0 0Z"></path></g>
            {/*  */}
            <g transform="translate(1090, 0)"><path className="fill-blue-500 hidden" id="path-to1" d="M0 432.7C-14.3 349.7 -28.5 266.7 -72.7 271.4C-117 276.2 -191.2 368.7 -209.5 362.9C-227.8 357 -190.3 252.7 -220.6 220.6C-250.9 188.5 -348.9 228.7 -374.7 216.3C-400.5 204 -354 139 -351.6 94.2C-349.2 49.4 -390.9 24.7 -432.7 0L0 0Z"></path></g>
            <g transform="translate(-190, 600)"><path className="fill-blue-500 hidden" id="path-to2" d="M0 -432.7C44.2 -433.1 88.3 -433.5 104.8 -391.2C121.3 -348.9 110.1 -264 146.5 -253.7C182.9 -243.5 266.7 -307.9 305.9 -305.9C345.1 -303.9 339.6 -235.5 322.2 -186C304.7 -136.5 275.3 -106 291.7 -78.2C308.1 -50.3 370.4 -25.2 432.7 0L0 0Z"></path></g>
          </svg>
        </div>
      </div>
      <div className="w-full">
        <div className="max-w-8xl mx-auto">
          <div className="grid grid-cols-2">
            <div>
              <div>
                <svg class="w-[48px] h-[48px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9V4a3 3 0 0 0-6 0v5m9.92 10H2.08a1 1 0 0 1-1-1.077L2 6h14l.917 11.923A1 1 0 0 1 15.92 19Z"/>
                </svg>
              </div>
              <div>
                <h3>Buy</h3>
                <p>Browse our intuitive and user-friendly platform, where you can effortlessly navigate through various categories, artists, and themes. Immerse yourself in the rich narratives woven into each piece, as artists pour their emotions, perspectives, and inspirations onto the canvas. Delve into the stories behind the artwork, exploring the depths of meaning and the creative processes that brought them to life.</p>
              </div>
            </div>
          </div>
      </div>
      </div>
    </div>
  )
}

export default Home
