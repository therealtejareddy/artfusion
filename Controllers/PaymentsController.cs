using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
    }
}
