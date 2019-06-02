using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using WhoamiService.Models;
using WhoamiService.AuthOne;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace WhoamiService.Controllers
{
    [Authorize]
    [Route("/")]
    [ApiController]
    public class WhoAmiController : ControllerBase
    {

        // GET /
        [HttpGet]
        public ActionResult<UserModel> Get()
        {
            var identity = User.Identity as ClaimsIdentity;
            var data = identity.Claims.Single(c => c.Type == "data").Value;
            var user = JsonConvert.DeserializeObject<UserModel>(data);

            // TODO: use logger
            Console.WriteLine("User validated: " + user.username);

            return Ok(user);
        }
    }
}
