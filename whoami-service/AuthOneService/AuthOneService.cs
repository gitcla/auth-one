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
 
        private readonly TokenValidationParameters _tokenValidationParameters;

        public AuthOneService(string publicKey) {
            byte[] keyBytes = Convert.FromBase64String(publicKey);
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

        public TokenValidationParameters getTokenValidationParameters() {
            return this._tokenValidationParameters;
        }

        public UserModel validate(string token) {
            JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();

            SecurityToken securityToken;
            ClaimsPrincipal principal = tokenHandler.ValidateToken(token, this._tokenValidationParameters, out securityToken);

            var payload = principal.Claims.Single(c => c.Type == "data").Value;

            return JsonConvert.DeserializeObject<UserModel>(payload);
        }
    }
}
