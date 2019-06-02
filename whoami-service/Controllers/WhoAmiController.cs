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
            string token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJuYW1lIjoibWFyaW9AbHVpZ2kub3JnIiwiZnVsbE5hbWUiOiJNYXJpbyBSb3NzaSJ9LCJpYXQiOjE1NTk0Njg5MzIsImV4cCI6MTU1OTQ2OTIzMn0.LsLUDe9OV2glyZRDtp8sDRLCRwsz8eexfdk50dv_QXm9rY7Z_7_YF76ZH57PUMqusNk9oJi-NLuK7ZnhsmplRSJtGx8ywgr1auY_4TFY998Lcz0vBaUVDAUfUhAQxeWxrilcRSLq5JlTB2S-m7VlzTMMoMFI3SWgPGDLh9c8YDL2Caf03_m9Fys_ED6-tLIoYYje3FBoFWAZGD-r2FyAnP6ZKzQ35FvKsuccxrRsb0HIkTYVNYgNyNZHz1u-kcAn7xjZq6ErUvQjnm-6KtD96DolRlBV7AT-mQEXRfvQanCspANL06R9_QQUnPGt18dXi13F_PxIQTudGcbPN0mnVQ";

            var authService = new AuthOneService();
            var user = authService.validate(token);

            // TODO: use logger
            Console.WriteLine("User validated: " + user.username);

            return user;
        }
    }
}
