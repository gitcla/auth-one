using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using whoami_service.Models;
using System.Security.Cryptography.X509Certificates;
using System.Security.Cryptography;
using Microsoft.IdentityModel.Tokens;

using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Logging;
using Org.BouncyCastle.Security;
using Org.BouncyCastle.Crypto.Parameters;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

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
            // For debug purposes
            IdentityModelEventSource.ShowPII = true;

            // Should arrive on header request
            string token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJuYW1lIjoibWFyaW9AbHVpZ2kub3JnIiwiZnVsbE5hbWUiOiJNYXJpbyBSb3NzaSJ9LCJpYXQiOjE1NTk0MTE3OTgsImV4cCI6MTU1OTQxMjA5OH0.bMRrPp_VVttDq6TsnhFyQSx1hyJDRBceeeysGZxPV3L1g0VbrbKwZdvtzMImytK5QKkIc1DaD32CJWRJuzRg54v5sXhV9ew4PcG8ax_54khoNLEA7enQSTH5fMiGPILBDHFWg99X-6Xp17vtbtK9AaQ1c0nwjrv9UTf_hLWk41lqr_blXwOMG3hzJYKGNTas1Asg6XXGacPxv2fE3E73IwQ8ajDkGWgnYHzd6QMPtuGxhAKXp6Uxb3gc99x6vmlUtMI-I6urx7g7qNxXi5SsXeqNm3ZS47vqnzgjwaUjlmLqkEv5TZJLSX_ScOOdHOcGkT1oBFjn5sUhviZcDl6pOQ";

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

            SecurityToken securityToken;
            try {
                ClaimsPrincipal principal = tokenHandler.ValidateToken(token, parameters, out securityToken);
                Console.WriteLine(securityToken);

                var payload = ((JwtSecurityToken)securityToken).Payload["data"];
                Console.WriteLine(payload);

                // dynamic json = JValue.Parse(payload.toString());
                // UserModel userModel  = JsonConvert.DeserializeObject<UserModel>(payload);
                // Console.WriteLine(userModel);
            } catch (Exception ex) {
                Console.WriteLine(ex.Message);
            }

            return new UserModel { username = "Pippo", fullName = "Pippo Pluto" };
        }
    }
}
