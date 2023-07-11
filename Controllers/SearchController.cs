using ArtFusion.Data;
using ArtFusion.Models;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ArtFusion.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SearchController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public SearchController(ApplicationDbContext context) {
            _context = context;
        }
        // GET: api/<SearchController>
        [HttpGet]
        public IActionResult Get(string value)
        {
            var products = _context.Products.Where(p => p.Name!.StartsWith(value) && p.Status!="Sold Out").ToList();
            var likes = _context.Likes.ToList();
            var ProductResult = products.GroupJoin(likes,
                product => product.Id,
                like => like.ProductId,
                (product, like) => new ProductsDto()
                {
                    Id = product.Id,
                    Name = product.Name,
                    Description = product.Description,
                    Image = product.Image,
                    Likes = likes.Where(likeData => likeData.ProductId == product.Id).ToList(),
                    Status = product.Status,
                    CreatedAt = product.CreatedAt,
                    OwnerId = product.OwnerId,
                    CategoryId = product.CategoryId,
                    Price = product.Price,
                }
                ).GroupBy(p => p.Id).Select(p => p.First()).ToList();
            var users = _context.Users.Where(u => u.UserName!.StartsWith(value)).ToList();
            var followers = _context.Follows.ToList();
            var UsersResult = users.GroupJoin(followers,
                user => user.UserId,
                follow => follow.FollowedUserId,
                (user,follow) => new
                {
                    userId = user.UserId,
                    userName = user.UserName,
                    firstName = user.FirstName,
                    lastName = user.LastName,
                    email = user.Email,
                    profilePicURL = user.ProfilePicURL,
                    coverPicURL = user.CoverPicURL,
                    followersCount = followers.Where(f => f.FollowedUserId==user.UserId).ToList().Count,
                    soldOutCount = _context.Products.Where(p => p.OwnerId==user.UserId && p.Status=="Sold Out").ToList().Count,
                    listedCount = _context.Products.Where(p => p.OwnerId == user.UserId && p.Status != "Sold Out").ToList().Count
                }).GroupBy(u => u.userId).Select(u => u.First()).ToList();
            return Ok(new
            {
                products = ProductResult,
                users = UsersResult,
            });
        }
    }
}
