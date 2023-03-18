using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServerSide.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ServerSide.Controllers
{
    [Route("api/[controller]")]
    public class ReservationsController : Controller
    {
        private readonly EliveDbContext _context;

        public ReservationsController(EliveDbContext ctx)
        {
            _context = ctx;
        }

        [HttpGet] // GET: api/reservations
        public ActionResult<IEnumerable<Reservations>> Get()
        {
            IncomingJwtModel.User userContext = HttpContext.Items["user"] as IncomingJwtModel.User;
            string erpID = userContext.erpId;

            Boolean hasAccess = false;

            // do a thing to ensure they should have access
            if (erpID != null)
            {
                hasAccess = true;
            }

            if (hasAccess)
            {
                List<Reservations> reservationsDb = _context.reservations.Where(x => x.student == erpID).OrderBy(y => y.booktitle).ToList();
                return reservationsDb;
            }
            else
            {
                return Forbid();
            }
        }

        [HttpPost] // POST: api/reservations
        public IActionResult Post([FromBody]Books book)
        {
            try
            {
                IncomingJwtModel.User userContext = HttpContext.Items["user"] as IncomingJwtModel.User;
                string erpID = userContext.erpId;

                Boolean hasAccess = false;

                // do a thing to ensure they should have access
                if (erpID != null)
                {
                    hasAccess = true;
                }

                if (hasAccess)
                {
                    Reservations reservation = new Reservations();
                    reservation.booktitle = book.title;
                    reservation.bookid = book.id;
                    reservation.student = erpID;

                    _context.reservations.Add(reservation);
                    _context.Entry(reservation).State = EntityState.Added;
                    _context.SaveChanges();

                    return NoContent();
                }
                else
                {
                    return Forbid();
                }
            }
            catch (Exception e)
            {
                Console.Write(e.Message);
                // do some kind of logging before returning, please.
                return StatusCode(StatusCodes.Status418ImATeapot);
            }
        }
    }
}

