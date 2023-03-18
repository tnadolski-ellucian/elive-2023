using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace ServerSide.Models
{
	public class EliveDbContext : DbContext
    {
        public EliveDbContext(DbContextOptions<EliveDbContext> options): base(options)
        {
        }

        public DbSet<Books> books { get; set; }
        public DbSet<Reservations> reservations { get; set; }
        public DbSet<Waitlists> waitlists { get; set; }
    }
}

