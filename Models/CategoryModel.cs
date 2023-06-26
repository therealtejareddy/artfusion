using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Artfusion.Models
{
    public class CategoryModel
    {
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.Identity), Key()]
        public int CategoryId { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
    }
}
