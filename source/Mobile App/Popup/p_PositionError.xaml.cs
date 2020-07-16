using System;
using System.Collections.Generic;
using Rg.Plugins.Popup.Pages;
using Xamarin.Essentials;
using Xamarin.Forms;

namespace iMuseum.Popup
{
    public partial class p_PositionError : PopupPage
    {
        public p_PositionError()
        {
            InitializeComponent();
        }

        /// <summary>
        /// Handle the click of the button to open the settings.
        /// </summary>
        /// @author Gabriele Ursini
        void handleSettingSelection(Object sender, EventArgs e)
        {
            Launcher.OpenAsync(new Uri("app-settings:"));
        }
    }
}
