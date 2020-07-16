using System;
using System.Diagnostics;
using System.Threading.Tasks;
using Plugin.Permissions;
using Plugin.Permissions.Abstractions;
using Xamarin.Essentials;
using PermissionStatus = Plugin.Permissions.Abstractions.PermissionStatus;

namespace iMuseum.System
{
    public class System
    {
        public System()
        {
        }

        private static readonly System instance = new System();
        public static System Instance // single istance of the system
        {
            get
            {
                return instance;
            }
        }


        static System()
        {
        }


        public class authWrapper
        {

            public String message;
            public String code;

            public bool isSuccessFull() { return code.Equals("200"); }

        }

        public class positionWrapper : authWrapper
        {
            public Xamarin.Essentials.Location position;

            /// <summary>
            /// Get the distance from another postion in km
            /// </summary>
            /// @author Gabriele Ursini
            /// <returns> A distance </returns>
            public double getDistance(Xamarin.Essentials.Location newPosition) {
                return position.CalculateDistance(newPosition, DistanceUnits.Kilometers);
            }
        }


        /// <summary>
        /// Check the permissions for the geolocation
        /// </summary>
        /// @author Gabriele Ursini
        /// <returns> An auth wrapper</returns>
        private async Task<authWrapper> authorizeGeolocationAsync()
        {

            try
            {
                var status = await CrossPermissions.Current.CheckPermissionStatusAsync(Permission.Location);

                if (status != PermissionStatus.Granted || status == PermissionStatus.Unknown || status == PermissionStatus.Denied || status == PermissionStatus.Disabled)
                {

                    var results = await CrossPermissions.Current.RequestPermissionsAsync(new[] { Permission.Location }); // chiede il permesso
                    if (results.ContainsKey(Permission.Location))
                        status = results[Permission.Location];

                    if (status == PermissionStatus.Granted)
                        return new authWrapper() { code = "200", message = "ok" };
                    else if (status == PermissionStatus.Denied)
                    {
                        return new authWrapper() { code = "401", message = "Access to the position denied." };
                    }
                    else {
                        return new authWrapper() { code = "401", message = "Access to the position disabled." };
                    }

                }
                else if (status == PermissionStatus.Granted)
                    return new authWrapper() { code = "200", message = "ok" };

            }
            catch (Exception e)
            {
                return new authWrapper() { code = "500", message = e.Message };
            }

            return new authWrapper() { code = "200", message = "ok" };

        }

        /// <summary>
        /// Get the current posistion of the device
        /// </summary>
        /// @author Gabriele Ursini
        /// <returns>A wrapper containing the position of the user or an error</returns>
        public async Task<positionWrapper> getPositionAsync()
        {

            var positionRequest = await authorizeGeolocationAsync();
            if (!positionRequest.isSuccessFull())
                return new positionWrapper() { code = positionRequest.code, message = positionRequest.message };

            try
            {
                //var request = new GeolocationRequest(GeolocationAccuracy.Medium);
            
                
                var position = await Geolocation.GetLastKnownLocationAsync();
                return new positionWrapper() { code = "200", message = "ok", position = position };
            }
            catch (Exception e)
            {
                return new positionWrapper() { code = "500", message = e.Message };
            }

        }


        /// <summary>
        /// Makes the device vibrate.
        /// </summary>
        /// @author Gabriele Ursini
        public void vibrate() {

            try
            {
                var duration = TimeSpan.FromSeconds(2);
                Vibration.Vibrate(duration);
            }
           
            catch (Exception ex)
            {
                Debug.WriteLine(ex);
            }
        }
    }
}
