using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ArtFusion.Data;
using Artfusion.Models;

namespace ArtFusion.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserAddressController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UserAddressController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/UserAddress
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<UserAddressModel>>> GetUserAddress(string userId)
        {
          if (_context.UserAddress == null)
          {
              return NotFound();
          }
            return await _context.UserAddress.Where(a => a.UserId==userId).ToListAsync();
        }

        // PUT: api/UserAddress/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUserAddressModel(string id, UserAddressModel userAddressModel)
        {
            if (id != userAddressModel.Id)
            {
                return BadRequest();
            }

            _context.Entry(userAddressModel).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserAddressModelExists(id))
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

        // POST: api/UserAddress
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<UserAddressModel>> PostUserAddressModel(UserAddressModel userAddressModel)
        {
          if (_context.UserAddress == null)
          {
              return Problem("Entity set 'ApplicationDbContext.UserAddress'  is null.");
          }
            userAddressModel.Id = Guid.NewGuid().ToString();
            _context.UserAddress.Add(userAddressModel);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (UserAddressModelExists(userAddressModel.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetUserAddressModel", new { id = userAddressModel.Id }, userAddressModel);
        }

        // DELETE: api/UserAddress/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUserAddressModel(string id)
        {
            if (_context.UserAddress == null)
            {
                return NotFound();
            }
            var userAddressModel = await _context.UserAddress.FindAsync(id);
            if (userAddressModel == null)
            {
                return NotFound();
            }

            _context.UserAddress.Remove(userAddressModel);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserAddressModelExists(string id)
        {
            return (_context.UserAddress?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
