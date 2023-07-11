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

namespace ArtFusion.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderDetailsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OrderDetailsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/OrderDetails
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderDetailsModel>>> GetOrderDetails()
        {
          if (_context.OrderDetails == null)
          {
              return NotFound();
          }
            return await _context.OrderDetails.ToListAsync();
        }

        // GET: api/OrderDetails/5
        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDetailsModel>> GetOrderDetailsModel(string id)
        {
          if (_context.OrderDetails == null)
          {
              return NotFound();
          }
            var orderDetailsModel = await _context.OrderDetails.FindAsync(id);

            if (orderDetailsModel == null)
            {
                return NotFound();
            }

            return orderDetailsModel;
        }

        // GET: api/OrderDetails/5
        [HttpGet("current-user")]
        public ActionResult GetAllUserOrderDetailsModel()
        {
            var token = Request.Headers["Authorization"].ToString().Substring(7);
            var handler = new JwtSecurityTokenHandler();
            var jwtSecurityToken = handler.ReadJwtToken(token);
            var currentUserId = jwtSecurityToken.Claims.ElementAt(0).Value;
            if (_context.OrderDetails == null)
            {
                return NotFound();
            }
            var products = _context.Products.ToList(); 
            var likes = _context.Likes.ToList();
            var orderDetailsModel = _context.OrderDetails.Where(o => o.UserId==currentUserId).ToList();
            var productsList = products.GroupJoin(likes,
                product => product.Id,
                like => like.ProductId,
                (product, like) => new ProductsDto()
                {
                    Id = product.Id,
                    Name = product.Name,
                    Description = product.Description,
                    Image = product.Image,
                    Likes = likes.Where(likeData => likeData.ProductId == product.Id).ToList(),
                    CreatedAt = product.CreatedAt,
                    OwnerId = product.OwnerId,
                    CategoryId = product.CategoryId,
                    Price = product.Price,
                }
                ).GroupBy(p => p.Id).Select(p => p.First()).ToList();
            var orders = orderDetailsModel.Join(productsList,
                order => order.ProductId,
                product => product.Id,
                (order, product) => new
                {
                    Id = product.Id,
                    Name = product.Name,
                    Description = product.Description,
                    Image = product.Image,
                    Likes = product.Likes,
                    CreatedAt = order.CreatedAt,
                    OwnerId = product.OwnerId,
                    CategoryId = product.CategoryId,
                    Price = product.Price,
                    Status = order.Status
                }
                ).ToList();
            if (orderDetailsModel == null)
            {
                return NotFound();
            }
            return Ok(new {data = orders});
        }

        // PUT: api/OrderDetails/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOrderDetailsModel(string id, OrderDetailsModel orderDetailsModel)
        {
            if (id != orderDetailsModel.OrderId)
            {
                return BadRequest();
            }

            _context.Entry(orderDetailsModel).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OrderDetailsModelExists(id))
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

        // POST: api/OrderDetails
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<OrderDetailsModel>> PostOrderDetailsModel(OrderDetailsModel orderDetailsModel)
        {
          if (_context.OrderDetails == null)
          {
              return Problem("Entity set 'ApplicationDbContext.OrderDetails'  is null.");
          }
            _context.OrderDetails.Add(orderDetailsModel);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (OrderDetailsModelExists(orderDetailsModel.OrderId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetOrderDetailsModel", new { id = orderDetailsModel.OrderId }, orderDetailsModel);
        }

        // DELETE: api/OrderDetails/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrderDetailsModel(string id)
        {
            if (_context.OrderDetails == null)
            {
                return NotFound();
            }
            var orderDetailsModel = await _context.OrderDetails.FindAsync(id);
            if (orderDetailsModel == null)
            {
                return NotFound();
            }

            _context.OrderDetails.Remove(orderDetailsModel);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool OrderDetailsModelExists(string id)
        {
            return (_context.OrderDetails?.Any(e => e.OrderId == id)).GetValueOrDefault();
        }
    }
}
