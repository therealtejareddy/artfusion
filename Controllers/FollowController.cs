using Artfusion.Models;
using ArtFusion.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe.Checkout;

namespace ArtFusion.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FollowController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public FollowController(ApplicationDbContext context)
        {
            _context = context;
        }
        [HttpPost("follow")]
        public IActionResult Follow(string followingUserId, string followedUserId)
        {

            FollowsModel followdata = new FollowsModel();
            followdata.FollowingUserId = followingUserId;
            followdata.FollowedUserId = followedUserId;
            followdata.CreatedAt = DateTime.Now;
            _context.Follows.Add(followdata);
            _context.SaveChanges();
            return Ok(followdata);
        }

        [HttpPost("unfollow")]
        public IActionResult UnFollow(string followingUserId, string followedUserId)
        {

            FollowsModel followdata = new FollowsModel();
            followdata.FollowingUserId = followingUserId;
            followdata.FollowedUserId = followedUserId; //current user
      //      followdata.CreatedAt = DateTime.Now;
            _context.Follows.Remove(followdata);
            _context.SaveChanges();
            return Ok(new {data="Unfollowed"});
        }

        [HttpPost("like")]
        public IActionResult Like(string productId, string userId)
        {
            LikesModel likeData = new LikesModel();
            likeData.ProductId = productId;
            likeData.UserId = userId;
            likeData.CreatedAt = DateTime.Now;
            _context.Likes.Add(likeData);
            _context.SaveChanges();
            return Ok(likeData);
        }

        [HttpPost("unlike")]
        public IActionResult UnLike(string productId, string userId)
        {
            LikesModel likeData = new LikesModel();
            likeData.ProductId = productId;
            likeData.UserId = userId;
            _context.Likes.Remove(likeData);
            _context.SaveChanges();
            return Ok(new {data="Unliked Successfully"});
        }

        
    }
}
