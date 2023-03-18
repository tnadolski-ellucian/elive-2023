using System;
namespace ServerSide.Models
{
    public class Books
    {
        public string id { get; set; }
        public string title { get; set; }
        public string type { get; set; }
        public string subject { get; set; }
        public string location { get; set; }
        public Boolean availability { get; set; }
    }
}

