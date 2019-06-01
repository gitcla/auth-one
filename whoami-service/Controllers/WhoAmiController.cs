using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Security.Cryptography;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Logging;
using Org.BouncyCastle.Security;
using Org.BouncyCastle.Crypto.Parameters;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using whoami_service.Models;

namespace whoami_service.Controllers
{
    [Route("/")]
    [ApiController]
    public class WhoAmiController : ControllerBase
    {
        private const string PublicKey = @"
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA7H3kztq99wQY2ClKjFQU
mB/Z+S9Gi2KkG+AzoqSEZID+ldCdp/qKyI9z70K1zfa8gN5I7GgSZSKlhj8HLhmM
UceKwjzM5y8tjJgEuWTLv91a6IVLry1kuhy10mGJteLMqF80z9lx3+SlMipKe5ac
LJ3mH6og6PK/UIl1viHcjHBIuwDepcRvKOUPcmlvaDBLaCaGZMNY+FZ9k1chel8h
jVY1z3EP8n57+gdz9yJ3u0BQ0oQcaJNsCvYUbDK17hl1O59ZV25DdKHPuFo89A4j
scc52/MLs2d5GNfTEllv7cRpy6EBtd1JR8WuVwiSfAsvs61MJ6i/jhnb6QuFJ8MX
WQIDAQAB
";

        // GET /
        [HttpGet]
        public ActionResult<UserModel> Get()
        {
            // For debugging purposes
            IdentityModelEventSource.ShowPII = true;

            // Should arrive on header request
            string token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJuYW1lIjoibWFyaW9AbHVpZ2kub3JnIiwiZnVsbE5hbWUiOiJNYXJpbyBSb3NzaSJ9LCJpYXQiOjE1NTk0MjM1MjEsImV4cCI6MTU1OTQyMzgyMX0.RO2eXaMPTwSesrnGY2FZw7rB3sLcXyyiXawX6OQ2qcZEHvIxP4jjE8FwGtK8pQ2dFA5MAEcMVu_Tu90RabQT7cuuvGL6j_WPx1MZdeZ5tF40OLnuf-j-41_K7J6aYLU6WgNyCblC-UYYMGIupjRutVmh3qdVp2MWXPkh_u-Vj-R0Yv51u6RnG1JUwM7qYCUNmGQi3x7JyjfYXCaqctu2UCJKRjvDwvdFgAJhXDmWrfSAEHZ_haUFX-uuN0gEnAa3-HfUFBeKDykPv_RoBglhYsDrLxoRuLdeD91cqyZLlHuhx5pqjZo5xTWXPvMfi6xdrp3ZQvH9-H-ShF23GXlApA";

            JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();

            byte[] keyBytes = Convert.FromBase64String(PublicKey);
            var asymmetricKeyParameter = PublicKeyFactory.CreateKey(keyBytes);
            var rsaKeyParameters = (RsaKeyParameters)asymmetricKeyParameter;
            var rsaParameters = new RSAParameters
            {
                Modulus = rsaKeyParameters.Modulus.ToByteArrayUnsigned(),
                Exponent = rsaKeyParameters.Exponent.ToByteArrayUnsigned()
            };
            var rsa = RSA.Create(2048);
            rsa.ImportParameters(rsaParameters);

            TokenValidationParameters parameters = new TokenValidationParameters()
            {
                RequireExpirationTime = true,
                RequireSignedTokens = true,
                ValidateIssuer = false,
                ValidateAudience = false,
                IssuerSigningKey = new RsaSecurityKey(rsa)
            };

            try {
                SecurityToken securityToken;
                ClaimsPrincipal principal = tokenHandler.ValidateToken(token, parameters, out securityToken);

                var payload = principal.Claims.Single(c => c.Type == "data").Value;

                UserModel user = JsonConvert.DeserializeObject<UserModel>(payload);

                return user;
            } catch(SecurityTokenExpiredException ex) {
                // exception Message is returned on response only for debugging purposes
                return StatusCode(401, ex.Message);
            } catch(Exception ex) {
                // exception Message is returned on response only for debugging purposes
                Console.WriteLine(ex.GetType());
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
    }
}
