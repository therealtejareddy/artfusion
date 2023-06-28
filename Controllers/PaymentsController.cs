using ArtFusion.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using NuGet.Protocol;
using Stripe;
using Stripe.Checkout;
using System.Collections;

namespace ArtFusion.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentsController : ControllerBase
    {
        [HttpPost("checkout")]
        public async Task<IActionResult> StripeCheckout([FromBody] CheckoutSessionDto req)
        {
            //Console.WriteLine(req.Count);
            Stripe.StripeConfiguration.ApiKey = "sk_test_51IV9euJ3fcy584Vl4M06FXrWsyIgIunJJqUpg16zEziAB8hiML7urmge7VpeZaGawxq4tV901UEwplSWyCIjFrSb00AoTbP7CO";
            List<SessionLineItemOptions> allItems = new List<SessionLineItemOptions>();
            for(int i = 0;i<req.items.Count;i++)
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
                        }
                    },
                    Quantity = 1
                };
                allItems.Add(item);
            }
            var options = new SessionCreateOptions
            {
                SuccessUrl = "https://google.com/",
                LineItems = allItems,
                Mode = "payment",
            };
            var service = new SessionService();
            var session = service.Create(options);
            return Ok(new {id= session.Id });
        }
        [HttpPost("webhook")]
        public async Task<IActionResult> WebHookHandler()
        {
            string endpointSecret = "whsec_c6c8ff44d229c398e51a8cd1475f20d76f1222fe40668db4ff41a099b7bc3d29";
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
            try
            {
                var stripeEvent = EventUtility.ConstructEvent(json,
                    Request.Headers["Stripe-Signature"], endpointSecret);

                // Handle the event
                if (stripeEvent.Type == Events.CheckoutSessionAsyncPaymentSucceeded)
                {
                    Console.WriteLine("paymentIntent success");
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
                return BadRequest();
            }
        }
    }


}
