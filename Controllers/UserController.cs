using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ArtFusion.Data;
using Artfusion.Models;
using System.IdentityModel.Tokens.Jwt;
using ArtFusion.Models;
using Stripe;

namespace ArtFusion.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/User
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserModel>>> GetUsers()
        {
          if (_context.Users == null)
          {
              return NotFound();
          }
            return await _context.Users.ToListAsync();
        }

        // GET: api/User/5
        [HttpGet("{id}")]
        public async Task<ActionResult> GetUserModel(string id)
        {
          if (_context.Users == null)
          {
              return NotFound();
          }
            var userModel = await _context.Users.FindAsync(id);
            var listedProducts = _context.Products.Where(p => p.OwnerId == id && p.Status!="Sold Out").ToList();
            var soldOutProducts = _context.Products.Where(p => p.OwnerId == id && p.Status == "Sold Out").ToList();
            var token = Request.Headers["Authorization"].ToString().Substring(7);
            var handler = new JwtSecurityTokenHandler();
            var jwtSecurityToken = handler.ReadJwtToken(token);
            var currentUserId = jwtSecurityToken.Claims.ElementAt(0).Value;
            var followers = _context.Follows.Where(d => d.FollowedUserId == id && d.FollowingUserId==currentUserId).ToList();
            var followersCount = _context.Follows.Where(d => d.FollowedUserId == id).ToList().Count;
            var likes = _context.Likes.ToList();
            var listedResult = listedProducts.GroupJoin(likes,
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
            var soldOutResult = soldOutProducts.GroupJoin(likes,
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
            if (userModel == null)
            {
                return NotFound();
            }

            return Ok(new
            {
                userId = userModel.UserId,
                userName = userModel.UserName,
                role = userModel.Role,
                email = userModel.Email,
                firstName = userModel.FirstName,
                lastName = userModel.LastName,
                state = userModel.State,
                city = userModel.City,
                listedProducts = listedResult,
                soldOutProducts = soldOutResult,
                followers = followers,
                followersCount = followersCount,
                profilePicURL = userModel.ProfilePicURL,
                coverPicURL = userModel.CoverPicURL
            });
        }

        [HttpGet("current-user")]
        public ActionResult GetCurrentUser()
        {
            var token = Request.Headers["Authorization"].ToString().Substring(7);
            var handler = new JwtSecurityTokenHandler();
            var jwtSecurityToken = handler.ReadJwtToken(token);
            var currentUserId = jwtSecurityToken.Claims.ElementAt(0).Value;
            Console.WriteLine(currentUserId);
            var userModel = _context.Users.Find(currentUserId);
            var followersCount = _context.Follows.Where(d => d.FollowedUserId == currentUserId).ToList().Count;
            /*var listedProducts = _context.Products.Where(p => p.Status!="Sold Out").ToList();
            var soldOutproducts = _context.Products.Where(p => p.OwnerId == currentUserId && p.Status=="Sold Out").ToList();*/
            var products = _context.Products.ToList();
            var likes = _context.Likes.ToList();
            var result = products.GroupJoin(likes,
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
            var listedProducts = result.Where(p => p.Status != "Sold Out" & p.OwnerId==currentUserId).ToList();
            var soldOutProducts = result.Where(p => p.Status == "Sold Out" & p.OwnerId==currentUserId).ToList();
            return Ok(new
            {
                userId = currentUserId,
                userName = userModel!.UserName,
                firstName = userModel.FirstName,
                lastName = userModel.LastName,
                email = userModel.Email,
                city = userModel.City,
                state = userModel.State,
                listedProducts = listedProducts,
                soldOutProducts = soldOutProducts,
                followersCount = followersCount,
                profilePicURL = userModel.ProfilePicURL,
                coverPicURL = userModel.CoverPicURL
            });
        }

        [HttpGet("current-user/liked")]
        public ActionResult<IEnumerable<ProductsDto>> GetUserLikedProducts()
        {
            var token = Request.Headers["Authorization"].ToString().Substring(7);
            var handler = new JwtSecurityTokenHandler();
            var jwtSecurityToken = handler.ReadJwtToken(token);
            var currentUserId = jwtSecurityToken.Claims.ElementAt(0).Value;
            if (_context.Products == null)
            {
                return NotFound();
            }
            var products = _context.Products.ToList();
            //var products = _context.Products.ToList();
            var likes = _context.Likes.Where(l => l.UserId==currentUserId).ToList();
            var result = likes.Join(products,
                like => like.ProductId,
                product => product.Id,
                (like, product) => new ProductsDto()
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
            return result;
        }

        // PUT: api/User/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUserModel(string id, UserModel userModel)
        {
            if (id != userModel.UserId)
            {
                return BadRequest();
            }
            var user = await _context.Users.FindAsync(id);
            userModel.Email = user.Email;
            userModel.UserId = user.UserId;
            userModel.UserName = user.UserName;
            userModel.PasswordHash = user.PasswordHash;
            userModel.CreatedAt = user.CreatedAt;
            userModel.Role = user.Role;
            if(userModel.ProfilePicURL == null)
            {
                userModel.ProfilePicURL = user.ProfilePicURL;
            }
            if(userModel.CoverPicURL==null)
            {
                userModel.CoverPicURL = user.CoverPicURL;
            }

            _context.Entry(userModel).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserModelExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/User
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<UserModel>> PostUserModel(UserModel userModel)
        {
          if (_context.Users == null)
          {
              return Problem("Entity set 'ApplicationDbContext.Users'  is null.");
          }
            _context.Users.Add(userModel);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (UserModelExists(userModel.UserId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetUserModel", new { id = userModel.UserId }, userModel);
        }

        // DELETE: api/User/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUserModel(string id)
        {
            if (_context.Users == null)
            {
                return NotFound();
            }
            var userModel = await _context.Users.FindAsync(id);
            if (userModel == null)
            {
                return NotFound();
            }

            _context.Users.Remove(userModel);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserModelExists(string id)
        {
            return (_context.Users?.Any(e => e.UserId == id)).GetValueOrDefault();
        }
    }
}
