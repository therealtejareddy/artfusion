using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ArtFusion.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DataController : ControllerBase
    {
/*        [Authorize(Roles ="Admin")]*/
        [HttpGet("cool")]
        public string Get()
        {
            return "Cool";
        }
    }
}
