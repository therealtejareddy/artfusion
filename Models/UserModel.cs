using System.ComponentModel.DataAnnotations;

namespace Artfusion.Models
{
    public class UserModel
    {
        [Key]
        public string? UserId { get; set; }
        public string? UserName { get; set; }
        public string? PasswordHash { get; set; }
        public string? Email { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public DateTime? CreatedAt { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? Role { get; set; }
        public string? ProfilePicURL { get; set; }
        public string? CoverPicURL { get; set; }

    }
}
