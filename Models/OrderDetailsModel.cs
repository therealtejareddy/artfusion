using System.ComponentModel.DataAnnotations;

namespace Artfusion.Models
{
    public class OrderDetailsModel
    {
        [Key]
        public string? OrderId { get; set; }
        public string? ProductId { get; set; }
        public string? UserId { get; set; }
        public string? PaymentId { get; set; }
        public string? DelivaryAddressId { get; set; }
        public string? Status { get; set; }
        public DateTime? CreatedAt { get; set; }
    }
}
