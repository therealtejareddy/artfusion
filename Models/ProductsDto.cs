namespace ArtFusion.Models
{
    public class ProductsDto
    {
        public string? Id { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? Image { get; set; }
        public int CategoryId { get; set; }
        public string? OwnerId { get; set; }
        public DateTime? CreatedAt { get; set; }
        public string? Status { get; set; }
        public int LikesCount { get; set; }
    }
}
