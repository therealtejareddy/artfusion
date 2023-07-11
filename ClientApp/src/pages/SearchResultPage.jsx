import React, {useEffect,useState, useContext } from 'react'
import ProductCardComponent from '../components/ProductCardComponent';
import UserProfileCardComponent from '../components/UserProfileCardComponent';
import CategoriesComponent from '../components/CategoriesComponent';
import {useParams, useNavigate, createSearchParams, useSearchParams} from "react-router-dom"
import { getRequestOptions } from '../utils/utils';
import { appContext } from '../context/appContext';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

function SearchResultPage() {
  const [products, setProducts] = useState([])
  const [users, setUsers] = useState([])
  const [categoryName, setCategoryName] = useState()
  const {categoryId} = useParams();
  const {categories} = useContext(appContext)
  const navigate = useNavigate();
  const [searchParams] = useSearchParams()


  useEffect(() => {
      async function fetchData() {
          let response = await fetch(`api/Search?value=${searchParams.get("search")}`,getRequestOptions);
          let data = await response.json()
          setProducts(data.products)
          setUsers(data.users)
      }
      fetchData()

    console.log(searchParams.get("search"));
    }, [categoryId])
    
  async function handleSearch(e){
    navigate({
      pathname:"/products/search",
      search: createSearchParams({
        search:e.target.search.value
      }).toString()
    })
  }

  return (
    <div className="pt-[4rem]">
      <div className="flex max-w-8xl mx-auto pt-4">
        <div className="z-0">
          <CategoriesComponent></CategoriesComponent>
        </div>
        <div className="w-full z-0">
          <div class="w-full flex items-center justify-between">
            <div>
              {
                <h2 className="ml-6">Search Reasults for "{searchParams.get("search")}"</h2>
              }
            </div>
            <div className="w-1/2"> 
              <form onSubmit={handleSearch}>   
                  <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                  <div class="relative">
                      <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                          </svg>
                      </div>
                      <input name="search" type="search" id="default-search" class="block w-full pt-4 pb-4 pr-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Products, Users..." required/>
                      <button type="submit" class="text-white absolute right-2.5 bottom-3.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
                  </div>
              </form>
            </div>
          </div>
          <div className="pl-4">
            <Tabs>
                <TabList>
                    <Tab>Products</Tab>
                    <Tab>Users</Tab>
                </TabList>
                <TabPanel>
                    <h3>Products</h3>
                    <div className="w-full flex flex-wrap justify-center -z-10">
                        {
                        products.map(product => {
                            return <ProductCardComponent key={product.id} ownerId={product.ownerId} id={product.id} name={product.name} description={product.description} price={product.price} image={product.image} likes={product.likes} likesCount={product.likes.length} createdAt={product.createdAt} status={product.status}></ProductCardComponent>
                        })
                        }
                    </div>
                </TabPanel>
                <TabPanel>
                        <h3>Users</h3>
                        <div className="w-full flex flex-wrap justify-center">
                            {
                                users.map(user =>{
                                  return <UserProfileCardComponent key={user.userId} userId={user.userId} coverPicURL={user.coverPicURL} profilePicURL={user.profilePicURL}  userName={user.userName}  firstName={user.firstName}  lastName={user.lastName}  email={user.email} followersCount={user.followersCount} soldOutCount={user.soldOutCount} listedCount={user.listedCount}/>
                                })
                            }
                        </div>
                </TabPanel>
            </Tabs>
          </div>
        </div>
      </div>
            
    </div>
  )
}

export default SearchResultPage