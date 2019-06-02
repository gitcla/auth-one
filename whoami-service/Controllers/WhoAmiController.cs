using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
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
        private readonly ILogger<WhoAmiController> _logger;

        public WhoAmiController(ILogger<WhoAmiController> logger) {
            this._logger = logger;
        }

        // GET /
        [HttpGet]
        public ActionResult<UserModel> Get()
        {
            var identity = User.Identity as ClaimsIdentity;
            var data = identity.Claims.Single(c => c.Type == "data").Value;
            var user = JsonConvert.DeserializeObject<UserModel>(data);

            this._logger.LogInformation("User validated: ({user})", user);

            return Ok(user);
        }
    }
}
