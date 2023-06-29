import { postRequestOptions } from "./utils"

export const followHandler = async (userId, currentUserId) => {
    let response = await fetch(`/api/Follow/follow?followingUserId=${currentUserId}&followedUserId=${userId}`,postRequestOptions);
    let data = await response.json()
    return response.status
}
export const unFollowHandler = async (userId, currentUserId) => {
    let response = await fetch(`/api/Follow/unfollow?followingUserId=${currentUserId}&followedUserId=${userId}`,postRequestOptions);
    let data = await response.json()
    return response.status
}