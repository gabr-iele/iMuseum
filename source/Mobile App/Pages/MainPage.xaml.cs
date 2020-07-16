using System;
using System.Threading.Tasks;
using iMuseum.Model;
using iMuseum.Popup;
using iMuseum.View;
using Plugin.Geolocator;
using Plugin.Geolocator.Abstractions;
using Rg.Plugins.Popup.Extensions;
using Xamarin.Forms;
using static iMuseum.System.System;

namespace iMuseum.Pages
{
    public partial class MainPage : ContentPage
    {

        public Museum current; // nearest musueum

        public void setCurrentMuseumForDemo(Museum demo) {
            current = demo;
        }

        private positionWrapper latestPosition;

        private static double DISTANCE_BEFORE_RECOMPUTATION = 10; // distance in km before attempting another location
        private view_Museum museum_view;

        public MainPage()
        {
            InitializeComponent();
            this.startPositionListner();

        }


        protected override void OnAppearing()
        {
            base.OnAppearing();
            this.startPositionListner();
        }

        /// <summary>
        /// Start the position listner.
        /// </summary>
        /// @author Gabriele Ursini
        private async Task startPositionListner()
        {
      
            var auth = await System.System.Instance.getPositionAsync();
            if (auth.code == "500")
            {
                await DisplayAlert("Error", "This device does not support geolocation, please use a device with geolocation support.", "ok");
                return;
            }
            else if (auth.code == "401")
            {
                await Navigation.PushPopupAsync(new p_PositionError());
                return;
            }
            else {
                CrossGeolocator.Current.PositionChanged += HandlePositionChanged;
                await CrossGeolocator.Current.StartListeningAsync(TimeSpan.FromSeconds(10), 100);
            }
        }

        /// <summary>
        /// Handle the reception of a beacon packet
        /// </summary>
        /// @author Gabriele Ursini
        private async void handleBeaconReadings (object sender, EventArgs e)
        {
            String sensorID = sender as String;
            await this.getPieceFromSensor(sensorID);
          
          
        }

        /// <summary>
        /// Display a piece from the ID of the sensor positioned over
        /// </summary>
        /// <param name="sensorID"></param>
        /// <returns></returns>
        public async Task getPieceFromSensor(String sensorID) {

            if (!current.isThereAVisitInProgress) { return; }

            var transitRequest = await PersistanceStorage.PersistanceStorage.Instance.getPieceFromSensor(sensorID, current.current.ID);
            if (!transitRequest.isSuccessFull())
            {
                await DisplayAlert("Error", transitRequest.message, "Ok");
                return;
            }

            var piece = transitRequest.getPiece();
            if (piece != null)
            {
                current.current.addPieceToList(piece);
                System.System.Instance.vibrate();
                await Navigation.PushPopupAsync(new p_Piece(piece));
            }
        }

        /// <summary>
        /// Handle the change of position.
        /// </summary>
        /// @author Gabriele Ursini
        private async void HandlePositionChanged(object sender, PositionEventArgs e)
        {
            
            positionWrapper new_position = new positionWrapper()
            {
                position = new Xamarin.Essentials.Location(e.Position.Latitude, e.Position.Longitude)
            };

            await this.findClosestMuseumAsync(new_position);
        }


        /// <summary>
        /// Find the closest museum near the user
        /// </summary>
        /// @author Gabriele Ursini
        private async Task findClosestMuseumAsync(positionWrapper position)
        {

            if (latestPosition == null)
                latestPosition = position;
            else
            {
                if (position.getDistance(latestPosition.position) >= DISTANCE_BEFORE_RECOMPUTATION)
                    latestPosition = position;
                else { return; }
            }

            var museumRequest = await PersistanceStorage.PersistanceStorage.Instance.getClosestMuseumAsync(new PersistanceStorage.PersistanceStorage.requestWrapper()
            {
                lat = latestPosition.position.Latitude,
                lon = latestPosition.position.Longitude,
            });
            current = museumRequest.getMuseum();
            if (current != null) {
                System.System.Instance.vibrate();
                pageStack.Children.Add(museum_view = new view_Museum(this.current));
            }
              

        }

    }
}
