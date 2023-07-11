using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ArtFusion.Data;
using ArtFusion.Models;

namespace ArtFusion.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShoppingCartItemController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ShoppingCartItemController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/ShoppingCartItem
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ShoppingCartItemModel>>> GetShoppingCartItem()
        {
          if (_context.ShoppingCartItem == null)
          {
              return NotFound();
          }
            return await _context.ShoppingCartItem.ToListAsync();
        }

        // GET: api/ShoppingCartItem/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ShoppingCartItemModel>> GetShoppingCartItemModel(string id)
        {
          if (_context.ShoppingCartItem == null)
          {
              return NotFound();
          }
            var shoppingCartItemModel = await _context.ShoppingCartItem.FindAsync(id);

            if (shoppingCartItemModel == null)
            {
                return NotFound();
            }

            return shoppingCartItemModel;
        }
        [HttpGet("all/user/{userId}")]
        public ActionResult<List<ProductsDto>> GetAllItemsByUser(string userId)
        {
            if (_context.ShoppingCartItem == null)
            {
                return NotFound();
            }
            var shoppingCartItemsList = _context.ShoppingCartItem.Where(item => item.UserId == userId).ToList();
            var products = _context.Products.ToList();
            var likes = _context.Likes.ToList();
            var productsResult = products.GroupJoin(likes,
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
            var result = shoppingCartItemsList.Join(productsResult,
                shoppingCartItem => shoppingCartItem.ProductId,
                product => product.Id,
                (shoppingCartItem, product) => new ProductsDto()
                {
                    Id = product.Id,
                    Name = product.Name,
                    Description = product.Description,
                    Image = product.Image,
                    Likes = product.Likes,
                    Status = product.Status,
                    CreatedAt = product.CreatedAt,
                    OwnerId = product.OwnerId,
                    CategoryId = product.CategoryId,
                    Price = product.Price,
                }
                ).ToList();
            if (shoppingCartItemsList == null)
            {
                return NotFound();
            }

            return result;
        }

        // POST: api/ShoppingCartItem
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ShoppingCartItemModel>> PostShoppingCartItemModel(ShoppingCartItemModel shoppingCartItemModel)
        {
          if (_context.ShoppingCartItem == null)
          {
              return Problem("Entity set 'ApplicationDbContext.ShoppingCartItem'  is null.");
          }
            if (_context.Products.Find(shoppingCartItemModel.ProductId).Status!="Sold Out")
            {
                shoppingCartItemModel.Id = Guid.NewGuid().ToString();
                _context.ShoppingCartItem.Add(shoppingCartItemModel);
            }
            if(_context.ShoppingCartItem.Where(p => p.ProductId==shoppingCartItemModel.ProductId && p.UserId==shoppingCartItemModel.UserId).Count()>0)
            {
                return Conflict(new
                {
                    message="Art Already Contains in Cart"
                });
            }
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (ShoppingCartItemModelExists(shoppingCartItemModel.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetShoppingCartItemModel", new { id = shoppingCartItemModel.Id }, shoppingCartItemModel);
        }

        // DELETE: api/ShoppingCartItem/5
        [HttpDelete("{userId}/{productId}")]
        public  IActionResult DeleteShoppingCartItemModel(string userId, string productId)
        {
            if (_context.ShoppingCartItem == null)
            {
                return NotFound();
            }
            var shoppingCartItemModel = _context.ShoppingCartItem.Where(item => item.UserId == userId && item.ProductId == productId).First();
            if (shoppingCartItemModel == null)
            {
                return NotFound();
            }

            _context.ShoppingCartItem.Remove(shoppingCartItemModel);
             _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ShoppingCartItemModelExists(string id)
        {
            return (_context.ShoppingCartItem?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
