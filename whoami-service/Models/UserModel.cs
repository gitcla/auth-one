namespace WhoamiService.Models
{
    public class UserModel {
        public string username { get; set; }
        public string fullName { get; set; }

        public override string ToString() {
            return "username: " + this.username + ", fullName: " + this.fullName;
        }
    }
}
