using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Stripe;
using Stripe.Checkout;

namespace ArtFusion.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentsController : ControllerBase
    {
        [HttpPost("checkout")]
        public IActionResult StripeCheckout()
        {
            Stripe.StripeConfiguration.ApiKey = "sk_test_4eC39HqLyjWDarjtT1zdp7dc";

            var options = new SessionCreateOptions
            {
                SuccessUrl = "https://google.com/",
                LineItems = new List<SessionLineItemOptions>
                 {
                    new SessionLineItemOptions
                    {
                      PriceData = new SessionLineItemPriceDataOptions
                      {
                          Currency = "INR",
                          UnitAmount = 5000,
                          ProductData = new SessionLineItemPriceDataProductDataOptions
                          {
                              Description = "Description",
                              Name = "Name",
                          }
                      },
                      Quantity = 2,

                    },
                 },
                Mode = "payment",
            };
            var service = new SessionService();
            var session = service.Create(options);
            return Ok(session.Url);
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
