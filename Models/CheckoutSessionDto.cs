namespace ArtFusion.Models
{
    public class CheckoutSessionDto
    {
        public List<CheckoutSessionProductDto> items { get; set; }
    }

    public class CheckoutSessionProductDto
    {
        public string? Id { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? Image { get; set; }
        public double Price { get; set; }
    }
}


