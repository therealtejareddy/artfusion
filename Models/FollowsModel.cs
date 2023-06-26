namespace Artfusion.Models
{
    public class FollowsModel
    {
        public string? FollowingUserId { get; set; }
        public string? FollowedUserId { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
