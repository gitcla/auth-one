using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Logging;
using WhoamiService.Models;
using WhoamiService.AuthOne;

namespace WhoamiService.Controllers
{
    [Route("/")]
    [ApiController]
    public class WhoAmiController : ControllerBase
    {

        // GET /
        [HttpGet]
        public ActionResult<UserModel> Get()
        {
            // For debugging purposes
            IdentityModelEventSource.ShowPII = true;

            // Should arrive on header request
            string token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJuYW1lIjoibWFyaW9AbHVpZ2kub3JnIiwiZnVsbE5hbWUiOiJNYXJpbyBSb3NzaSJ9LCJpYXQiOjE1NTk0Njc3MjgsImV4cCI6MTU1OTQ2ODAyOH0.ywBgfT6NvfJ09GgUg1gjQw8tyQH8SgzC68Rw5VxdneBwVW6zdk8mNqA4XQOqwkbYrZ0iKKPNj7ADZ99MC4q6WcEc9Hj5HhvFgM01Z1MY3q2Aejy8-_3dpmc-UuTmh7orsB1YeJwe4hLVzFvKUqEbNb2oxfFcUnWRrLnqyU1uzVURE6KUzddT8OHm7wkD7LiJb4yybsIVeAqPCtPd3bvwf5hC9MecC0PX8uctyEmyJF_KpeB7UJx0VnEJrbN4k2m_fLglVY9DUa2xhWEWyUv9s1xq28xO0x466IEZ3qyH9V1qO4cOvBPcUsFnwm9FbIwI3ORgbCVlv4jDtOei6r_Hbg";

            var authService = new AuthOneService();
            var user = authService.validate(token);

            Console.WriteLine(user);

            return user;
        }
    }
}
