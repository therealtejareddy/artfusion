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
using System.IdentityModel.Tokens.Jwt;
using ArtFusion.Services;

namespace ArtFusion.Controllers
{
    //[Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IEmailService _emailService;
        public ProductsController(ApplicationDbContext context, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        // GET: api/Products
        [HttpGet]
        public ActionResult<IEnumerable<ProductsDto>> GetProducts()
        {
          if (_context.Products == null)
          {
              return NotFound();
          }
            var token = Request.Headers["Authorization"].ToString().Substring(7);
            var handler = new JwtSecurityTokenHandler();
            var jwtSecurityToken = handler.ReadJwtToken(token);
            var currentUserId = jwtSecurityToken.Claims.ElementAt(0).Value;
            var products =   _context.Products.Where(p => p.Status!="Sold Out" && p.OwnerId!=currentUserId).ToList();
            //var products = _context.Products.ToList();
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
            var productMetaData = _context.ProductMetadata.Where(m => m.ProductId ==id).ToList();
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
                MetaData = productMetaData,
                OwnerUsername = _context.Users.Find(productsModel.OwnerId)!.UserName
            };
            return product;
        }

        [HttpGet("category/{categoryId}")]
        public ActionResult<IEnumerable<ProductsDto>> GetProducts(int categoryId)
        {
            if (_context.Products == null)
            {
                return NotFound();
            }
            var products = _context.Products.Where(p => p.Status != "Sold Out" && p.CategoryId==categoryId).ToList();
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
                    OwnerUsername = _context.Users.Find(product.OwnerId).UserName
                }
                ).GroupBy(p => p.Id).Select(p => p.First()).ToList();
            return result;
        }

        // PUT: api/Products/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProductsModel(string id, ProductAddDto product)
        {
            if (id != product.Id)
            {
                return BadRequest();
            }
            ProductsModel productsModel = new ProductsModel();
            productsModel.Id = id;
            productsModel.Name = product.Name;
            productsModel.Description = product.Description;
            productsModel.Image = product.Image;
            productsModel.CategoryId = product.CategoryId;
            productsModel.Price = product.Price;
            productsModel.OwnerId= product.OwnerId;
            productsModel.CreatedAt = DateTime.Now;
            productsModel.Status = "Listed";
            _context.Entry(productsModel).State = EntityState.Modified;
            //_context.Products.Update(productsModel);
            var metaData = _context.ProductMetadata.AsNoTracking().Where(m => m.ProductId == product.Id).ToList();
            if (metaData.Count>0)
            {
                for (int i = 0; i < metaData.Count; i++)
                {
                    var productMetadata = new ProductMetadataModel();
                    productMetadata.ProductId = id;
                    productMetadata.MetaDataKey = product.MetaData[i][0];
                    productMetadata.MetaDataValue = product.MetaData[i][1];
                    _context.Entry(productMetadata).State = EntityState.Modified;
                    //_context.ProductMetadata.Update(productMetadata);
                }
                _context.SaveChanges();
                for (int i = metaData.Count - 1; i < product.MetaData.Count; i++)
                {
                    var productMetadata = new ProductMetadataModel();
                    productMetadata.ProductId = id;
                    productMetadata.MetaDataKey = product.MetaData[i][0];
                    productMetadata.MetaDataValue = product.MetaData[i][1];
                    _context.ProductMetadata.Add(productMetadata);
                }
            }
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
        public async Task<ActionResult<ProductsModel>> PostProductsModel(ProductAddDto product)
        {
          if (_context.Products == null)
          {
              return Problem("Entity set 'ApplicationDbContext.Products'  is null.");
          }
          ProductsModel productsModel = new ProductsModel();
            productsModel.Name = product.Name;
            productsModel.Description = product.Description;
            productsModel.Price = product.Price;
            productsModel.CategoryId = product.CategoryId;
            productsModel.Image = product.Image;
            var productId = Guid.NewGuid().ToString();
            productsModel.Id = productId;
            productsModel.OwnerId = product.OwnerId;
            productsModel.Status = "Listed";
            productsModel.CreatedAt = DateTime.Now;
            _context.Products.Add(productsModel);
            for(int i = 0; i < product.MetaData.Count; i++)
            {
                ProductMetadataModel productMetadata = new ProductMetadataModel();
                productMetadata.ProductId = productId;
                productMetadata.MetaDataKey = product.MetaData[i][0];
                productMetadata.MetaDataValue = product.MetaData[i][1];
                _context.ProductMetadata.Add(productMetadata);
            }
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
            var followers = _context.Follows.Where(f => f.FollowedUserId==product.OwnerId).ToList();
            var allUsers = _context.Users.ToList();
            var followersEmails = allUsers.Join(
                followers, user => user.UserId,
                follow => follow.FollowingUserId,
                (user, follow) => new
                {
                    FollowingUserId = user.UserId,
                    FollowingEmail = user.Email
                }).Select(f => f.FollowingEmail).ToList();
            var ownerUserName = _context.Users.Find(product.OwnerId).UserName;
            string mailBody = @"<!DOCTYPE html>
                                    <html lang=""en"" xmlns=""http://www.w3.org/1999/xhtml"" xmlns:o=""urn:schemas-microsoft-com:office:office"">
                                    <head>
	                                    <meta charset=""UTF-8"">
	                                    <meta name=""viewport"" content=""width=device-width,initial-scale=1"">
	                                    <meta name=""x-apple-disable-message-reformatting"">
	                                    <title></title>
	                                    <!--[if mso]>
	                                    <noscript>
		                                    <xml>
			                                    <o:OfficeDocumentSettings>
				                                    <o:PixelsPerInch>96</o:PixelsPerInch>
			                                    </o:OfficeDocumentSettings>
		                                    </xml>
	                                    </noscript>
	                                    <![endif]-->
	                                    <style>
		                                    table, td, div, h1, p {font-family: Arial, sans-serif;}
	                                    </style>
                                    </head>
                                    <body style=""margin:0;padding:0;"">
	                                    <table role=""presentation"" style=""width:100%;border-collapse:collapse;border:0;border-spacing:0;background:#ffffff;"">
		                                    <tr>
			                                    <td align=""center"" style=""padding:0;"">
				                                    <table role=""presentation"" style=""width:602px;border-collapse:collapse;border:1px solid #cccccc;border-spacing:0;text-align:left;"">
					                                    <tr>
						                                    <td align=""center"" style=""padding:40px 0 30px 0;background:#701ba9;"">
							                                    <img src=""https://res.cloudinary.com/dy5jbitxn/image/upload/v1688559962/logo/artfusion-mail.png"" alt="""" width=""300"" style=""height:auto;display:block;"" />
						                                    </td>
					                                    </tr>
					                                    <tr>
						                                    <td style=""padding:36px 30px 42px 30px;"">
							                                    <table role=""presentation"" style=""width:100%;border-collapse:collapse;border:0;border-spacing:0;"">
								                                    <tr>
									                                    <td style=""padding:0 0 36px 0;color:#153643;"">
										                                    <h1 style=""font-size:24px;margin:0 0 20px 0;font-family:Arial,sans-serif;text-align;center"">"+ownerUserName+@" Added New Art</h1>
									                                    </td>
								                                    </tr>
								                                    <tr>
									                                    <td style=""padding:0;"">
										                                    <table role=""presentation"" style=""width:100%;border-collapse:collapse;border:0;border-spacing:0;"">
											                                    <tr>
												                                    <td style=""width:260px;padding:0;vertical-align:top;color:#153643;"">
													                                    <p style=""margin:0 0 25px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;""><img src="""+product.Image+ @""" alt="""" width=""320"" style=""height:auto;display:block;margin:0 auto;"" /></p>
                                                                                        <h2 style=""text-align:center;"">"+product.Name+@"</h2>
													                                    <p style=""margin:0 0 12px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;"">" + product.Description+@"</p>
													                                    <p style=""margin:0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;""><a href=""http://www.example.com"" style=""color:#ee4c50;text-decoration:underline;"">Buy Now</a></p>
												                                    </td>
												                                    <td style=""width:20px;padding:0;font-size:0;line-height:0;"">&nbsp;</td>
											                                    </tr>
										                                    </table>
									                                    </td>
								                                    </tr>
							                                    </table>
						                                    </td>
					                                    </tr>
					                                    <tr>
						                                    <td style=""padding:30px;background:#ee4c50;"">
							                                    <table role=""presentation"" style=""width:100%;border-collapse:collapse;border:0;border-spacing:0;font-size:9px;font-family:Arial,sans-serif;"">
								                                    <tr>
									                                    <td style=""padding:0;width:50%;"" align=""left"">
										                                    <a href=""#"" style=""color:#ffffff;text-decoration:underline;""><h1>Artfusion</h1></a>
										                                    </p>
									                                    </td>
									                                    <td style=""padding:0;width:50%;"" align=""right"">
										                                    <table role=""presentation"" style=""border-collapse:collapse;border:0;border-spacing:0;"">
											                                    <tr>
												                                    <td style=""padding:0 0 0 10px;width:38px;"">
													                                    <a href=""http://www.twitter.com/"" style=""color:#ffffff;""><img src=""https://assets.codepen.io/210284/tw_1.png"" alt=""Twitter"" width=""38"" style=""height:auto;display:block;border:0;"" /></a>
												                                    </td>
												                                    <td style=""padding:0 0 0 10px;width:38px;"">
													                                    <a href=""http://www.facebook.com/"" style=""color:#ffffff;""><img src=""https://assets.codepen.io/210284/fb_1.png"" alt=""Facebook"" width=""38"" style=""height:auto;display:block;border:0;"" /></a>
												                                    </td>
											                                    </tr>
										                                    </table>
									                                    </td>
								                                    </tr>
							                                    </table>
						                                    </td>
					                                    </tr>
				                                    </table>
			                                    </td>
		                                    </tr>
	                                    </table>
                                    </body>
                                    </html>";
            string mailTitle = $"Artfusion - New Art Added | Buy Quick";
            await _emailService.SendEmailAsync("yuvatejareddy003@gmail.com",mailTitle , mailBody, followersEmails);

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
