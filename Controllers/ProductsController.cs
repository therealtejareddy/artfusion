using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ArtFusion.Data;
using Artfusion.Models;
using ArtFusion.Models;
using Microsoft.AspNetCore.Authorization;
using System.Drawing;

namespace ArtFusion.Controllers
{
    //[Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Products
        [HttpGet]
        public ActionResult<IEnumerable<ProductsDto>> GetProducts()
        {
          if (_context.Products == null)
          {
              return NotFound();
          }
            var products =   _context.Products.Where(p => p.Status!="Sold Out").ToList();
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
                    Likes = likes.Where(likeData => likeData.ProductId==product.Id).ToList(),
                    Status = product.Status,
                    CreatedAt = product.CreatedAt,
                    OwnerId = product.OwnerId,
                    CategoryId = product.CategoryId,
                    Price = product.Price,
                }
                ).GroupBy(p => p.Id).Select(p => p.First()).ToList();
            return result;
        }

        // GET: api/Products/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductsDto>> GetProductsModel(string id)
        {
          if (_context.Products == null)
          {
              return NotFound();
          }
            var productsModel = await _context.Products.FindAsync(id);
            var likesCount = _context.Likes.Where(likeData => likeData.ProductId == id).ToList();


            if (productsModel == null)
            {
                return NotFound();
            }
            ProductsDto product = new ProductsDto()
            {
                Id = productsModel.Id,
                Name = productsModel.Name,
                Description = productsModel.Description,
                Image = productsModel.Image,
                Likes = likesCount,
                Status = productsModel.Status,
                CreatedAt = productsModel.CreatedAt,
                OwnerId = productsModel.OwnerId,
                CategoryId = productsModel.CategoryId,
                Price = productsModel.Price,
            };

            return product;
        }

        // PUT: api/Products/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProductsModel(string id, ProductsModel productsModel)
        {
            if (id != productsModel.Id)
            {
                return BadRequest();
            }

            _context.Entry(productsModel).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductsModelExists(id))
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

        // POST: api/Products
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ProductsModel>> PostProductsModel(ProductsModel productsModel)
        {
          if (_context.Products == null)
          {
              return Problem("Entity set 'ApplicationDbContext.Products'  is null.");
          }
            productsModel.Id = Guid.NewGuid().ToString();
            productsModel.Status = "Listed";
            productsModel.CreatedAt = DateTime.Now;
            _context.Products.Add(productsModel);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (ProductsModelExists(productsModel.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetProductsModel", new { id = productsModel.Id }, productsModel);
        }

        // DELETE: api/Products/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProductsModel(string id)
        {
            if (_context.Products == null)
            {
                return NotFound();
            }
            var productsModel = await _context.Products.FindAsync(id);
            if (productsModel == null)
            {
                return NotFound();
            }

            _context.Products.Remove(productsModel);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProductsModelExists(string id)
        {
            return (_context.Products?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
