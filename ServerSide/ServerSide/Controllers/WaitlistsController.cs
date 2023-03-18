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
    public class WaitlistsController : Controller
    {
        private readonly EliveDbContext _context;

        public WaitlistsController(EliveDbContext ctx)
        {
            _context = ctx;
        }

        [HttpGet] // GET: api/waitlists
        public ActionResult<IEnumerable<Waitlists>> Get()
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
                List<Waitlists> waitlistsDb = _context.waitlists.Where(x => x.student == erpID).OrderBy(y => y.booktitle).ToList();
                return waitlistsDb;
            }
            else
            {
                return Forbid();
            }
        }

        [HttpPost] // POST: api/waitlists
        public IActionResult Post([FromBody] Books book)
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
                    Waitlists waitlist = new Waitlists();

                    waitlist.booktitle = book.title;
                    waitlist.bookid = book.id;
                    waitlist.student = erpID;

                    _context.waitlists.Add(waitlist);
                    _context.Entry(waitlist).State = EntityState.Added;
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

