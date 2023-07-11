using Artfusion.Models;
using ArtFusion.Data;
using ArtFusion.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using NuGet.Protocol;
using Stripe;
using Stripe.Checkout;
using System.Collections;
using System.IdentityModel.Tokens.Jwt;

namespace ArtFusion.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentsController : ControllerBase
    {

        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public PaymentsController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("checkout")]
        public IActionResult StripeCheckout([FromBody] CheckoutSessionDto req)
        {
            //Console.WriteLine(req.Count);
            var token = Request.Headers["Authorization"].ToString().Substring(7);
            var handler = new JwtSecurityTokenHandler();
            var jwtSecurityToken = handler.ReadJwtToken(token);
            var currentUserId = jwtSecurityToken.Claims.ElementAt(0).Value;
            Console.WriteLine(currentUserId);


            Stripe.StripeConfiguration.ApiKey = _configuration.GetSection("Stripe:ApiKey").Value;
            List<SessionLineItemOptions> allItems = new List<SessionLineItemOptions>();
            var metaData = new Dictionary<string, string>();
            metaData.Add("userId", currentUserId);
            metaData.Add("deliveryAddressId", req.DeliveryAddressId);
            for (int i = 0;i<req.items.Count;i++)
            {
                var item = new SessionLineItemOptions
                {
                    PriceData = new SessionLineItemPriceDataOptions
                    {
                        Currency = "INR",
                        UnitAmount = Convert.ToInt64(req.items[i].Price * 100),
                        ProductData = new SessionLineItemPriceDataProductDataOptions
                        {
                            Description = req.items[i].Description,
                            Name = req.items[i].Name,
                            Images = new List<string>() { req.items[i].Image }
                        },
                    },
                    Quantity = 1,
                };
                allItems.Add(item);
                metaData.Add($"product{i+1}", req.items[i].Id);
            }
            var options = new SessionCreateOptions
            {
                SuccessUrl = "https://localhost:44453/cart/checkout/success",
                LineItems = allItems,
                Mode = "payment",
                Metadata = metaData
                
            };
            var service = new SessionService();
            var session = service.Create(options);
            return Ok(new {id= session.Id });
        }
        [HttpPost("webhook")]
        public async Task<IActionResult> WebHookHandler()
        {
            string endpointSecret = _configuration.GetSection("Stripe:WebHookKey").Value;
            StripeConfiguration.ApiKey = _configuration.GetSection("Stripe:ApiKey").Value;
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
            try
            {
                var stripeEvent = EventUtility.ConstructEvent(json,
                    Request.Headers["Stripe-Signature"], endpointSecret, throwOnApiVersionMismatch:false);
                // Handle the event
                if (stripeEvent.Type == Events.CheckoutSessionCompleted)
                {
                    var session = stripeEvent.Data.Object as Session;
                    if (session.PaymentStatus == "paid")
                    {
                        Console.WriteLine("------------------------paid-------------------------");
                        var sessionId = session.Id;
                        var service = new SessionService();
                        List<LineItem> lineItems = service.ListLineItems(sessionId).Data;
                        long amount = 0;
                        foreach (var item in lineItems)
                        {
                            amount = amount + item.AmountTotal;
                        }
                        PaymentsModel paymentsModel = new PaymentsModel()
                        {
                            PaymentId = sessionId,
                            UserId = session.Metadata["userId"],
                            CreatedAt = DateTime.Now,
                            Amount = amount/100,
                        };
                        _context.Payments.Add(paymentsModel);
                        foreach(var kvp in session.Metadata)
                        {
                            Console.WriteLine(kvp.Key);
                            Console.WriteLine(kvp.Value);
                            if (kvp.Key.StartsWith("product"))
                            {
                                OrderDetailsModel orderDetailsModel = new OrderDetailsModel()
                                {
                                    OrderId = "order-" + Guid.NewGuid().ToString(),
                                    ProductId = kvp.Value,
                                    UserId = session.Metadata["userId"],
                                    PaymentId = sessionId,
                                    CreatedAt = DateTime.Now,
                                    DelivaryAddressId = session.Metadata["deliveryAddressId"],
                                    Status = "Ordered"
                                };
                                var shoppingCartItemModel = _context.ShoppingCartItem.Where(i => i.ProductId == kvp.Value && i.UserId == session.Metadata["userId"]).ToList();
                                if (shoppingCartItemModel.Count > 0)
                                {
                                    _context.ShoppingCartItem.Remove(shoppingCartItemModel.First());
                                }
                                _context.OrderDetails.Add(orderDetailsModel);
                                Console.WriteLine(kvp.Value);
                                ProductsModel productsModel = _context.Products.Find(kvp.Value);
                                productsModel.Status = "Sold Out";
                                _context.Entry(productsModel).State=EntityState.Modified;
                            }
                        }
                        _context.SaveChanges();
                    }
                }
                else if(stripeEvent.Type == Events.PaymentIntentSucceeded)
                {
                    var session = stripeEvent.Data.Object as Session;
/*                    if (session.PaymentStatus == "paid")
                    {
                        var sessionId = session.Id;
                        var service = new SessionService();
                        List<LineItem> lineItems = service.ListLineItems(sessionId).Data;
                        Console.WriteLine(lineItems[0].ToString());
                    }*/
                }
                // ... handle other event types
                else
                {
                    Console.WriteLine("Unhandled event type: {0}", stripeEvent.Type);
                }

                return Ok();
            }
            catch (StripeException e)
            {
                Console.WriteLine(e.Message);
                return BadRequest();
            }
        }
    }


}
