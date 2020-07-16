using System;
using UniversalBeacon.Library.Core.Entities;
using OpenNETCF.IoC;
using System.Collections.ObjectModel;
using System.Diagnostics;
using System.ComponentModel;
using Plugin.Permissions;
using Plugin.Permissions.Abstractions;
using System.Threading.Tasks;

namespace iMuseum.BeaconListner
{
    public class BeaconListner : INotifyPropertyChanged
    {

        public event PropertyChangedEventHandler PropertyChanged;

        private BeaconService _service;
        public ObservableCollection<Beacon> Beacons => _service?.Beacons;
        private Beacon _selectedBeacon;


        public async Task RequestPermissions()
        {
            await RequestLocationPermission();
        }

        private async Task RequestLocationPermission()
        {
            // Actually coarse location would be enough, the plug-in only provides a way to request fine location
            var requestedPermissions = await CrossPermissions.Current.RequestPermissionsAsync(Plugin.Permissions.Abstractions.Permission.Location);
            var requestedPermissionStatus = requestedPermissions[Plugin.Permissions.Abstractions.Permission.Location];
            Debug.WriteLine("Location permission status: " + requestedPermissionStatus);
            if (requestedPermissionStatus == PermissionStatus.Granted)
            {
                Debug.WriteLine("Starting beacon service...");
                StartBeaconService();
            }
        }


        private void StartBeaconService()
        {
            _service = RootWorkItem.Services.Get<BeaconService>();
            if (_service == null)
            {
                _service = RootWorkItem.Services.AddNew<BeaconService>();
                if (_service.Beacons != null) _service.Beacons.CollectionChanged += Beacons_CollectionChanged;
            }
        }

        private void Beacons_CollectionChanged(object sender,EventArgs e)
        {
            Debug.WriteLine($"Beacons_CollectionChanged {sender} e {e}");
        }


        public Beacon SelectedBeacon
        {
            get => _selectedBeacon;
            set
            {
                _selectedBeacon = value;
                PropertyChanged.Fire(this, "SelectedBeacon");
            }
        }
    }
}
