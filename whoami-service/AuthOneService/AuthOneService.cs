using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Security.Cryptography;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using Org.BouncyCastle.Security;
using Org.BouncyCastle.Crypto.Parameters;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using WhoamiService.Models;

namespace WhoamiService.AuthOne {
    public class AuthOneService {
        private const string PublicKey = @"MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA7H3kztq99wQY2ClKjFQUmB/Z+S9Gi2KkG+AzoqSEZID+ldCdp/qKyI9z70K1zfa8gN5I7GgSZSKlhj8HLhmMUceKwjzM5y8tjJgEuWTLv91a6IVLry1kuhy10mGJteLMqF80z9lx3+SlMipKe5acLJ3mH6og6PK/UIl1viHcjHBIuwDepcRvKOUPcmlvaDBLaCaGZMNY+FZ9k1chel8hjVY1z3EP8n57+gdz9yJ3u0BQ0oQcaJNsCvYUbDK17hl1O59ZV25DdKHPuFo89A4jscc52/MLs2d5GNfTEllv7cRpy6EBtd1JR8WuVwiSfAsvs61MJ6i/jhnb6QuFJ8MXWQIDAQAB";

        private readonly TokenValidationParameters _tokenValidationParameters;

        public AuthOneService() {
            byte[] keyBytes = Convert.FromBase64String(PublicKey);
            var rsaKeyParameters = (RsaKeyParameters)PublicKeyFactory.CreateKey(keyBytes);
            var rsaParameters = new RSAParameters
            {
                Modulus = rsaKeyParameters.Modulus.ToByteArrayUnsigned(),
                Exponent = rsaKeyParameters.Exponent.ToByteArrayUnsigned()
            };
            var rsa = RSA.Create(2048);
            rsa.ImportParameters(rsaParameters);

            this._tokenValidationParameters = new TokenValidationParameters()
            {
                RequireExpirationTime = true,
                RequireSignedTokens = true,
                ValidateIssuer = false,
                ValidateAudience = false,
                IssuerSigningKey = new RsaSecurityKey(rsa)
            };
        }

        public UserModel validate(string token) {
            try {
                JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();

                SecurityToken securityToken;
                ClaimsPrincipal principal = tokenHandler.ValidateToken(token, this._tokenValidationParameters, out securityToken);

                var payload = principal.Claims.Single(c => c.Type == "data").Value;

                return JsonConvert.DeserializeObject<UserModel>(payload);
            } catch(SecurityTokenExpiredException ex) {
                // TODO: use logger
                Console.WriteLine(ex.Message);

                throw new UnauthorizedException("Token expired");
                // return StatusCode(401, ex.Message);
            } catch(Exception ex) {
                // TODO: use logger
                Console.WriteLine(ex.Message);

                throw new UnauthorizedException("Authentication failed");
                // return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
    }
}
