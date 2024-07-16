using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;
using Slugify;

namespace BE_tdtu_clubs_management.Models
{
    public class News
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public string? Sub_Content { get; set; }
        public string? Content { get; set; }
        public string? Author { get; set; }
        public string? Slug { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [NotMapped]
        public List<string>? HashTag { get; set; }
        public string? ImgUrl { get; set; }
        public string? Public_Id { get; set; }
        public string? Status { get; set; }

        // This property is used to store the JSON representation of HashTag
        public string? HashTagJson
        {
            get => HashTag != null ? JsonSerializer.Serialize(HashTag) : null;
            set => HashTag = value != null ? JsonSerializer.Deserialize<List<string>>(value) : new List<string>();
        }

        public void GenerateSlug()
        {
            if (!string.IsNullOrWhiteSpace(Title))
            {
                var slugHelper = new SlugHelper();
                Slug = slugHelper.GenerateSlug(Title);
            }
        }
    }
}
