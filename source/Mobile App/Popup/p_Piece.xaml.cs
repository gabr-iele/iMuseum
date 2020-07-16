using System;
using System.Collections.Generic;
using Xamarin.Forms;
using iMuseum.Model;
using Rg.Plugins.Popup.Pages;
using Rg.Plugins.Popup.Extensions;

namespace iMuseum.Popup
{
    public partial class p_Piece : PopupPage
    {
        Piece current;

        public p_Piece(Piece toDisplay)
        {
            InitializeComponent();
            this.BindingContext = current = toDisplay;
        }

        /// <summary>
        /// Handle the closure of the popup
        /// </summary>
        /// @author Gabriele Ursini
        async void handlePopupClosure(Object sender, EventArgs e)
        {
            await Navigation.PopPopupAsync();
        }
    }
}
