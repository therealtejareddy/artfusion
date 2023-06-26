using System.ComponentModel.DataAnnotations;

namespace Artfusion.Models
{
    public class PaymentsModel
    {
        [Key]
        public string? PaymentId { get; set; }
        public string? UserId { get; set; }
        public double Amount { get; set; }
        public DateTime? CreatedAt { get; set; }
    }
}
