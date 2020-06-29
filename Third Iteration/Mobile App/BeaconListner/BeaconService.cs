using System;
using UniversalBeacon.Library.Core.Entities;
using UniversalBeacon.Library.Core.Interfaces;
using OpenNETCF.IoC;
using Xamarin.Forms;
using System.Collections.ObjectModel;
using System.Diagnostics;

namespace iMuseum.BeaconListner
{
    public class BeaconService : IDisposable
    {
        private BeaconManager manager;

        public BeaconService() {
            this.test();
        }

        public void Dispose()
        {
            manager?.Stop();
        }

        public void test()
        {
            var provider = RootWorkItem.Services.Get<IBluetoothPacketProvider>();

            if (provider != null)
            {
                // create a beacon manager, giving it an invoker to marshal collection changes to the UI thread
                manager = new BeaconManager(provider, Device.BeginInvokeOnMainThread);
                manager.Start();
#if DEBUG
                manager.BeaconAdded += _manager_BeaconAdded;
                provider.AdvertisementPacketReceived += Provider_AdvertisementPacketReceived;
#endif // DEBUG
            }
        }

        public ObservableCollection<Beacon> Beacons => manager?.BluetoothBeacons;

#if DEBUG
        void _manager_BeaconAdded(object sender, Beacon e)
        {
            Debug.WriteLine($"_manager_BeaconAdded {sender} Beacon {e}");
        }

        void Provider_AdvertisementPacketReceived(object sender, UniversalBeacon.Library.Core.Interop.BLEAdvertisementPacketArgs e)
        {
            Debug.WriteLine($"Provider_AdvertisementPacketReceived {sender} Beacon {e}");
        }
#endif // DEBUG
    }
}
}
