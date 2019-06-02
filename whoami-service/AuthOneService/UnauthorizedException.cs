using System;

namespace WhoamiService.AuthOne {
    public class UnauthorizedException : Exception {
        public UnauthorizedException(string message) : base(message) { }
    }
}
