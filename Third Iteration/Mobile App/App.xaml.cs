using System;
using System.Globalization;
using System.Threading;
using iMuseum.Pages;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace iMuseum
{
    public partial class App : Application
    {
        public static Page mainPage = null;

        public static MainPage getMainPage() {
            return mainPage as MainPage;
        }

        public App()
        {
            InitializeComponent();
            mainPage = MainPage = new MainPage();
        }


        public static bool isAndroidPlatform()
        {
            return Device.RuntimePlatform == Device.Android;
        }

        public static bool isIosPlatform()
        {
            return Device.RuntimePlatform == Device.iOS;
        }


        protected override void OnStart()
        {
        }

        protected override void OnSleep()
        {
        }

        protected override void OnResume()
        {
        }
    }
}
