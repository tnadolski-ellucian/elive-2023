using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ServerSide.Models;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Globalization;
namespace ServerSide.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LibraryController : Controller
    {

        private readonly EliveDbContext _context;

        public LibraryController(EliveDbContext ctx)
        {
            _context = ctx;
        }

        [HttpGet("books")] // GET: api/library/books
        public ActionResult<IEnumerable<Books>> GetAllBooks()
        {
            List<Books> booksDb = _context.books.OrderBy(x => x.title).ToList();
            return booksDb;
        }

        [HttpGet("books/{id}")] // GET: api/library/books/00000000-0000-0000-0000-000000000000
        public ActionResult<Books> GetBook(string id)
        {
            try
            {
                Books booksDb = _context.books.Where(x => x.id == id).First();
                return booksDb;
            }
            catch (Exception e)
            {
                // do some kind of logging before returning, please.
                return NotFound();
            }
        }

        [HttpPatch("books/{id}")] // PATCH api/library/books/00000000-0000-0000-0000-000000000000
        public IActionResult Patch(string id, [FromBody]Books book)
        {
            if (book == null)
            {
                return BadRequest();
            }

            Books existingBook = _context.books.AsNoTracking().Where(x => x.id == book.id).FirstOrDefault();
            if (existingBook == null)
            {
                return NotFound();
            }

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
                    existingBook.availability = book.availability;
                    _context.Entry(existingBook).State = EntityState.Modified;
                    _context.SaveChanges();

                    return Ok();
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

