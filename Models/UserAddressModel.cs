using System.ComponentModel.DataAnnotations;

namespace Artfusion.Models
{
    public class UserAddressModel
    {
        [Key]
        public string? Id { get; set; }
        public string? UserId { get; set; }
        public string? AddressLane1 { get; set;}
        public string? AddressLane2 { get; set; }
        public string? City { get; set; }
        public string? PostalCode { get; set; }
        public string? Country { get; set; }
        public string? Phone { get; set; }
    }
}
