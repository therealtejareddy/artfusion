namespace ArtFusion.Models
{
    public class ProductAddDto
    {
        public string? Id { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? Image { get; set; }
        public int CategoryId { get; set; }
        public double Price { get; set; }
        public string? OwnerId { get; set; }
        public List<List<string>>? MetaData { get; set; }
    }
}
