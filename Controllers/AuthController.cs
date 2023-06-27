using Artfusion.Models;
using ArtFusion.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Artfusion.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        public ApplicationDbContext _context;
        public AuthController(IConfiguration configuration, ApplicationDbContext context)
        {
            _configuration = configuration;
            _context = context;
        }

        [HttpPost("register")]
        public ActionResult<UserModel> Register(UserDto request)
        {
            var existUser = _context.Users.Where(user => user.UserName == request.UserName).ToList();
            if (existUser.Count==0)
            {
                UserModel user = new UserModel();
                string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
                user.PasswordHash = passwordHash;
                user.UserName = request.UserName;
                user.CreatedAt = DateTime.Now;
                user.UserId = Guid.NewGuid().ToString();
                user.Role = "User";
                user.Email = request.Email;
                _context.Users.Add(user);
                _context.SaveChanges();
                return Ok(user);
            }
            return Ok(new { message = "User Already Exist" });
        }

        [HttpPost("login")]
        public ActionResult<UserModel> Login(UserDto request)
        {
            var userList = _context.Users.Where(user => user.UserName==request.UserName).ToList();
            if (userList.Count==0)
            {
                return BadRequest("User Not Exist");
            }
            if(!BCrypt.Net.BCrypt.Verify(request.Password, userList[0].PasswordHash))
            {
                return BadRequest("Wrong Password");
            }
            string token = CreateToken(userList[0]);
            return Ok(new {token=token});
        }

        private string CreateToken(UserModel userData)
        {
             List<Claim> claims = new List<Claim>() { 
                new Claim("name", userData.UserName!),
                new Claim("role", userData.Role!),
                new Claim("id",userData.UserId!),
                new Claim("email",userData.Email!),
             };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                _configuration.GetSection("Jwt:Token").Value!));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature);

            var token = new JwtSecurityToken(
                audience: _configuration.GetSection("Jwt:Token").Value,
                issuer: _configuration.GetSection("Jwt:Token").Value,
                    claims: claims,
                    expires : DateTime.Now.AddDays(1),
                    signingCredentials: creds
                );

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);
            return jwt;
        }
    }
}
