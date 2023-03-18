using System;
using Microsoft.EntityFrameworkCore;

namespace ServerSide.Models
{
    public class Waitlists
    {
        public int id { get; set; }
        public string booktitle { get; set; }
        public string bookid { get; set; }
        public string student { get; set; }
    }
}

